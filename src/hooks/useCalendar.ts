import { useState, useEffect } from 'react';
import { simpleGoogleCalendarApi } from '../services/simpleGoogleCalendarApi';
import { CalendarDay } from '../types';

export const useCalendar = (date: Date = new Date()) => {
  const [calendarDay, setCalendarDay] = useState<CalendarDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading calendar data from public iCal...');
        
        const calendarData = await simpleGoogleCalendarApi.getCalendarDay(date);
        setCalendarDay(calendarData);
        console.log('Calendar data loaded successfully:', calendarData);
      } catch (err) {
        console.error('Error loading calendar data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load calendar data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadCalendarData();

    // Refresh calendar data every 5 minutes
    const interval = setInterval(loadCalendarData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [date]);

  return { calendarDay, loading, error };
};
