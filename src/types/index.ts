export interface WeatherData {
  location: string;
  current: {
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: DailyForecast[];
}

export interface DailyForecast {
  date: string;
  dayName: string;
  morning: {
    temperature: number;
    description: string;
    icon: string;
  };
  afternoon: {
    temperature: number;
    description: string;
    icon: string;
  };
  moonPhase?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  description?: string;
  location?: string;
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  dayName: string;
  monthName: string;
  events: CalendarEvent[];
}
