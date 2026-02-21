import { Client } from '@notionhq/client';
import { CalendarEvent, CalendarDay } from '../types';

class NotionApiService {
  private client: Client;
  private databaseId: string | null = null;

  constructor() {
    this.client = new Client({
      auth: import.meta.env.VITE_NOTION_API_KEY,
    });
  }

  async initializeDatabase(): Promise<void> {
    try {
      // First, try to find calendar database
      const searchResponse = await this.client.search({
        filter: {
          property: 'object',
          value: 'database'
        },
        query: 'calendar'
      });

      if (searchResponse.results.length > 0) {
        const database = searchResponse.results[0] as any;
        this.databaseId = database.id;
        console.log('Found existing calendar database:', this.databaseId);
        return;
      }

      // If no database found, you'll need to create one manually in Notion
      throw new Error('No calendar database found. Please create a calendar database in Notion and share it with your integration.');
    } catch (error) {
      console.error('Error initializing Notion database:', error);
      throw error;
    }
  }

  async getTodayEvents(): Promise<CalendarEvent[]> {
    try {
      if (!this.databaseId) {
        await this.initializeDatabase();
      }

      if (!this.databaseId) {
        throw new Error('Database not initialized');
      }

      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          and: [
            {
              property: 'Date',
              date: {
                on_or_after: startOfDay.toISOString().split('T')[0],
              },
            },
            {
              property: 'Date',
              date: {
                before: endOfDay.toISOString().split('T')[0],
              },
            },
          ],
        },
        sorts: [
          {
            property: 'Date',
            direction: 'ascending',
          },
          {
            property: 'Time',
            direction: 'ascending',
          },
        ],
      });

      console.log('Notion events fetched:', response.results);

      return response.results.map((page: any) => this.transformNotionEvent(page));
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
      throw error;
    }
  }

  private transformNotionEvent(page: any): CalendarEvent {
    const properties = page.properties;
    
    return {
      id: page.id,
      summary: this.getPropertyValue(properties, 'Title') || 'Sans titre',
      start: {
        dateTime: this.getDateTimeValue(properties, 'Date', 'Time')
      },
      end: {
        dateTime: this.getDateTimeValue(properties, 'Date', 'Time')
      },
      description: this.getPropertyValue(properties, 'Description'),
      location: this.getPropertyValue(properties, 'Location')
    };
  }

  private getPropertyValue(properties: any, propertyName: string): string {
    const property = properties[propertyName];
    if (!property) return '';
    
    if (property.type === 'title' && property.title) {
      return property.title.map((t: any) => t.plain_text).join('');
    }
    
    if (property.type === 'rich_text' && property.rich_text) {
      return property.rich_text.map((t: any) => t.plain_text).join('');
    }
    
    if (property.type === 'select' && property.select) {
      return property.select.name || '';
    }
    
    if (property.type === 'date' && property.date) {
      return property.date.start || '';
    }
    
    return '';
  }

  private getDateTimeValue(properties: any, dateProperty: string, timeProperty: string): string {
    const dateProp = properties[dateProperty];
    const timeProp = properties[timeProperty];
    
    if (!dateProp || !dateProp.date) {
      return new Date().toISOString();
    }
    
    let dateStr = dateProp.date.start || dateProp.date;
    
    // Add time if available
    if (timeProp && timeProp.type === 'select' && timeProp.select) {
      const timeStr = timeProp.select.name;
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date(dateStr);
      date.setHours(hours, minutes, 0, 0);
      return date.toISOString();
    }
    
    return dateStr;
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
        events
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

export const notionApi = new NotionApiService();
