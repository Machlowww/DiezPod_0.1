import { CalendarEvent, CalendarDay } from '../types';

class SimpleCalendarApiService {
  // Using simple approach with sample data for now
  // We can later integrate with Google Calendar API properly

  async getTodayEvents(): Promise<CalendarEvent[]> {
    try {
      // For now, return sample data until we can properly access Google Calendar
      // This avoids all the OAuth and CORS complexity
      console.log('Using sample calendar data for now');
      return this.getSampleEvents();
    } catch (error) {
      console.error('Error getting today\'s events:', error);
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
}

export const simpleCalendarApi = new SimpleCalendarApiService();
