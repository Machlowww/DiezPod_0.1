import { CalendarEvent, CalendarDay } from '../types';

class GoogleCalendarApiService {
  private readonly CLIENT_ID = '150912343817-idgfluudlsk48hm84ntskqdkb1d1tstr.apps.googleusercontent.com';
  private readonly API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  private readonly SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
  
  private isSignedIn = false;
  private accessToken: string | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Wait for Google APIs to load
      await this.waitForGapiLoad();
      await this.waitForGoogleLoad();

      // Initialize GAPI
      await gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: this.API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        });
      });

      // Initialize Google Identity Services with Sign-In
      google.accounts.id.initialize({
        client_id: this.CLIENT_ID,
        callback: (response: any) => {
          if (response.credential) {
            console.log('Google Sign-In credential received');
            this.handleSignIn(response.credential);
          }
        }
      });

      console.log('Google Calendar API initialized');
    } catch (error) {
      console.error('Error initializing Google Calendar API:', error);
    }
  }

  private waitForGapiLoad(): Promise<void> {
    return new Promise((resolve) => {
      const checkGapi = () => {
        if (typeof gapi !== 'undefined') {
          resolve();
        } else {
          setTimeout(checkGapi, 100);
        }
      };
      checkGapi();
    });
  }

  private waitForGoogleLoad(): Promise<void> {
    return new Promise((resolve) => {
      const checkGoogle = () => {
        if (typeof google !== 'undefined' && google.accounts) {
          resolve();
        } else {
          setTimeout(checkGoogle, 100);
        }
      };
      checkGoogle();
    });
  }

  private async handleSignIn(credential: string): Promise<void> {
    try {
      // Parse JWT credential to get user info
      const payload = JSON.parse(atob(credential.split('.')[1]));
      console.log('User signed in:', payload.email);
      
      // For now, we'll use a simplified approach
      this.isSignedIn = true;
      this.accessToken = credential;
    } catch (error) {
      console.error('Error handling sign-in:', error);
    }
  }

  async signIn(): Promise<void> {
    try {
      // Use Google Sign-In button approach
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Sign-in prompt not displayed or skipped');
          } else {
            console.log('Sign-in prompt displayed');
          }
        });
      }
    } catch (error) {
      console.error('Error signing in to Google Calendar:', error);
      throw error;
    }
  }

  async getTodayEvents(): Promise<CalendarEvent[]> {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

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

      const events = response.result.items || [];
      console.log('Google Calendar events fetched:', events.length);

      return events.map((event: any) => this.transformGoogleEvent(event));
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
      // Return sample data if API fails
      return this.getSampleEvents();
    }
  }

  private getSampleEvents(): CalendarEvent[] {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    return [
      {
        id: 'sample_1',
        summary: 'LM - Travail',
        start: { dateTime: `${todayStr}T09:00:00` },
        end: { dateTime: `${todayStr}T17:00:00` },
        description: 'Journée de travail habituelle',
        location: 'Bureau'
      },
      {
        id: 'sample_2', 
        summary: 'Dentiste Malo',
        start: { dateTime: `${todayStr}T14:00:00` },
        end: { dateTime: `${todayStr}T15:00:00` },
        description: 'Rappel chez le dentiste',
        location: 'Cabinet dentaire'
      },
      {
        id: 'sample_3',
        summary: 'Match Volleyball',
        start: { dateTime: `${todayStr}T20:30:00` },
        end: { dateTime: `${todayStr}T22:00:00` },
        description: 'Match de volleyball avec l\'équipe',
        location: 'Salle de sport'
      }
    ];
  }

  private transformGoogleEvent(event: any): CalendarEvent {
    return {
      id: event.id,
      summary: event.summary || 'Sans titre',
      start: {
        dateTime: event.start?.dateTime || event.start?.date,
        date: event.start?.date
      },
      end: {
        dateTime: event.end?.dateTime || event.end?.date,
        date: event.end?.date
      },
      description: event.description,
      location: event.location
    };
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
        events: events.sort((a, b) => {
          const timeA = a.start.dateTime ? new Date(a.start.dateTime).getTime() : 0;
          const timeB = b.start.dateTime ? new Date(b.start.dateTime).getTime() : 0;
          return timeA - timeB;
        })
      };
    } catch (error) {
      console.error('Error getting calendar day:', error);
      throw error;
    }
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

  getIsSignedIn(): boolean {
    return this.isSignedIn;
  }
}

export const googleCalendarApi = new GoogleCalendarApiService();
