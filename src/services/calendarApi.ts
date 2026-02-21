import { CalendarEvent, CalendarDay } from '../types';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

class CalendarApiService {
  private readonly DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  private readonly SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
  private tokenClient: any = null;
  private gapiInited = false;
  private gisInited = false;
  private accessToken: string | null = null;

  async waitForGapiLoad(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkGapi = () => {
        if (typeof gapi !== 'undefined') {
          resolve();
        } else if (typeof gapi === 'undefined') {
          setTimeout(checkGapi, 100);
        } else {
          reject(new Error('GAPI failed to load'));
        }
      };
      checkGapi();
    });
  }

  async waitForGoogleLoad(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkGoogle = () => {
        if (typeof google !== 'undefined' && google.accounts) {
          resolve();
        } else if (typeof google === 'undefined') {
          setTimeout(checkGoogle, 100);
        } else {
          reject(new Error('Google Identity Services failed to load'));
        }
      };
      checkGoogle();
    });
  }

  async initializeGapi(): Promise<void> {
    try {
      await this.waitForGapiLoad();
      
      return new Promise((resolve, reject) => {
        gapi.load('client', async () => {
          try {
            await gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: [this.DISCOVERY_DOC],
            });
            this.gapiInited = true;
            console.log('GAPI initialized successfully');
            resolve();
          } catch (error) {
            console.error('GAPI initialization error:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error waiting for GAPI:', error);
      throw error;
    }
  }

  async initializeGis(): Promise<void> {
    try {
      await this.waitForGoogleLoad();
      
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: this.SCOPES,
        callback: (tokenResponse: any) => {
          console.log('Token response:', tokenResponse);
          if (tokenResponse && tokenResponse.access_token) {
            this.accessToken = tokenResponse.access_token;
            console.log('Access token received');
          } else if (tokenResponse && tokenResponse.error) {
            console.error('Token error:', tokenResponse.error);
          }
        },
      });
      
      this.gisInited = true;
      console.log('GIS initialized successfully');
    } catch (error) {
      console.error('Error initializing GIS:', error);
      throw error;
    }
  }

  async signIn(): Promise<void> {
    if (!this.tokenClient) {
      throw new Error('Token client not initialized');
    }

    return new Promise((resolve, reject) => {
      // Set a temporary callback for this sign-in attempt
      const originalCallback = this.tokenClient.callback;
      
      this.tokenClient.callback = (tokenResponse: any) => {
        console.log('Sign-in token response:', tokenResponse);
        
        if (tokenResponse && tokenResponse.access_token) {
          this.accessToken = tokenResponse.access_token;
          console.log('Sign-in successful');
          resolve();
        } else {
          console.error('Sign-in failed:', tokenResponse);
          reject(new Error(tokenResponse?.error || 'Failed to sign in'));
        }
        
        // Restore original callback
        this.tokenClient.callback = originalCallback;
      };
      
      try {
        this.tokenClient.requestAccessToken();
      } catch (error) {
        console.error('Error requesting access token:', error);
        reject(error);
      }
    });
  }

  async getTodayEvents(): Promise<CalendarEvent[]> {
    if (!this.gapiInited) {
      await this.initializeGapi();
    }

    if (!this.accessToken) {
      throw new Error('Not signed in');
    }

    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      console.log('Calendar events:', response.result.items);
      return response.result.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  async getCalendarDay(date: Date = new Date()): Promise<CalendarDay> {
    try {
      const events = await this.getTodayEvents();
      const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

      return {
        date,
        dayNumber: date.getDate(),
        dayName: daysOfWeek[date.getDay()],
        monthName: months[date.getMonth()],
        events: events.map(this.transformEvent)
      };
    } catch (error) {
      console.error('Error getting calendar day:', error);
      throw error;
    }
  }

  private transformEvent(event: any): CalendarEvent {
    return {
      id: event.id,
      summary: event.summary || 'Sans titre',
      start: event.start,
      end: event.end,
      description: event.description,
      location: event.location
    };
  }

  formatEventTime(event: CalendarEvent): string {
    if (event.start.dateTime) {
      const date = new Date(event.start.dateTime);
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    return 'Toute la journée';
  }

  formatEventDescription(event: CalendarEvent): string {
    if (event.description) {
      return event.description.length > 100 
        ? event.description.substring(0, 100) + '...' 
        : event.description;
    }
    return '';
  }

  isInitialized(): boolean {
    return this.gapiInited && this.gisInited;
  }

  isSignedIn(): boolean {
    return !!this.accessToken;
  }
}

export const calendarApi = new CalendarApiService();
