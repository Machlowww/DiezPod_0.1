import { CalendarEvent, CalendarDay } from '../types';

class ICalApiService {
  // Use your public iCal URL
  private readonly PUBLIC_ICAL_URL = 'https://calendar.google.com/calendar/ical/malo.flavie%40gmail.com/public/basic.ics';

  async fetchICalData(): Promise<string> {
    // Use public iCal URL directly
    try {
      console.log('Fetching public iCal URL...');
      const response = await fetch(this.PUBLIC_ICAL_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch iCal data: ${response.status}`);
      }
      const data = await response.text();
      console.log('Public iCal data fetched successfully');
      return data;
    } catch (error) {
      console.error('Error fetching iCal data:', error);
      throw error;
    }
  }

  parseICalData(icalData: string): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const lines = icalData.split('\n');
    let currentEvent: Partial<CalendarEvent> = {};
    let inEvent = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === 'BEGIN:VEVENT') {
        inEvent = true;
        currentEvent = {};
        continue;
      }
      
      if (line === 'END:VEVENT') {
        if (currentEvent.summary && currentEvent.start) {
          events.push({
            id: currentEvent.id || this.generateId(),
            summary: currentEvent.summary || 'Sans titre',
            start: currentEvent.start!,
            end: currentEvent.end || { dateTime: currentEvent.start?.dateTime || currentEvent.start?.date },
            description: currentEvent.description,
            location: currentEvent.location
          });
        }
        inEvent = false;
        currentEvent = {};
        continue;
      }

      if (!inEvent) continue;

      // Parse iCal properties
      if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.substring(8).replace(/\\n/g, '\n').replace(/\\,/g, ',');
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.substring(12).replace(/\\n/g, '\n').replace(/\\,/g, ',');
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.location = line.substring(9).replace(/\\n/g, '\n').replace(/\\,/g, ',');
      } else if (line.startsWith('DTSTART:')) {
        currentEvent.start = this.parseDateTime(line.substring(8));
      } else if (line.startsWith('DTEND:')) {
        currentEvent.end = this.parseDateTime(line.substring(6));
      } else if (line.startsWith('UID:')) {
        currentEvent.id = line.substring(4);
      }
    }

    return events;
  }

  private parseDateTime(dateString: string): { dateTime?: string; date?: string } {
    // iCal format: 20240220T140000Z or 20240220
    const hasTime = dateString.includes('T');
    
    if (hasTime) {
      // Format: 20240220T140000Z
      const year = parseInt(dateString.substring(0, 4));
      const month = parseInt(dateString.substring(4, 6)) - 1; // JS months are 0-indexed
      const day = parseInt(dateString.substring(6, 8));
      const hour = parseInt(dateString.substring(9, 11));
      const minute = parseInt(dateString.substring(11, 13));
      
      const date = new Date(year, month, day, hour, minute);
      return { dateTime: date.toISOString() };
    } else {
      // All-day event format: 20240220
      const year = parseInt(dateString.substring(0, 4));
      const month = parseInt(dateString.substring(4, 6)) - 1;
      const day = parseInt(dateString.substring(6, 8));
      
      const date = new Date(year, month, day);
      return { date: date.toISOString().split('T')[0] };
    }
  }

  private generateId(): string {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async getTodayEvents(): Promise<CalendarEvent[]> {
    try {
      const icalData = await this.fetchICalData();
      const allEvents = this.parseICalData(icalData);
      
      // Filter events for today
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      return allEvents.filter(event => {
        const eventStart = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date!);
        return eventStart >= startOfDay && eventStart < endOfDay;
      });
    } catch (error) {
      console.error('Error getting today\'s events:', error);
      
      // Return fallback sample data if iCal fails
      console.log('Using fallback sample data');
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

  async getCalendarDay(date: Date = new Date()): Promise<CalendarDay> {
    try {
      const events = await this.getTodayEvents();
      const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

      const calendarDay = {
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

      // Check if we're using sample data
      const hasSampleData = events.some(event => event.id.startsWith('sample_'));
      if (hasSampleData) {
        console.warn('⚠️ Using sample data - iCal URL not accessible');
        // Add a special event to indicate this is sample data
        calendarDay.events.unshift({
          id: 'sample_warning',
          summary: '⚠️ Données de démonstration',
          start: { dateTime: new Date().toISOString() },
          end: { dateTime: new Date().toISOString() },
          description: 'Impossible de charger votre calendrier Google. Vérifiez que votre calendrier est public ou utilisez une URL iCal accessible.',
          location: ''
        });
      }

      return calendarDay;
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
}

export const icalApi = new ICalApiService();
