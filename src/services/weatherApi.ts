import { WeatherData, DailyForecast } from '../types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const DEFAULT_LOCATION = import.meta.env.VITE_DEFAULT_LOCATION || 'Nantes,FR';

class WeatherApiService {
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  async getCurrentWeather(location: string = DEFAULT_LOCATION): Promise<WeatherData> {
    try {
      // Get current weather
      const currentResponse = await fetch(
        `${this.baseUrl}/weather?q=${location}&appid=${API_KEY}&units=metric&lang=fr`
      );
      
      if (!currentResponse.ok) {
        throw new Error(`Weather API error: ${currentResponse.status}`);
      }

      const currentData = await currentResponse.json();

      // Get 5-day forecast
      const forecastResponse = await fetch(
        `${this.baseUrl}/forecast?q=${location}&appid=${API_KEY}&units=metric&lang=fr`
      );

      if (!forecastResponse.ok) {
        throw new Error(`Forecast API error: ${forecastResponse.status}`);
      }

      const forecastData = await forecastResponse.json();

      return this.transformWeatherData(currentData, forecastData, location);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  private transformWeatherData(currentData: any, forecastData: any, location: string): WeatherData {
    // Transform current weather
    const current = {
      temperature: Math.round(currentData.main.temp),
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6) // Convert m/s to km/h
    };

    // Transform forecast data
    const forecast = this.processForecastData(forecastData);

    return {
      location: location.split(',')[0],
      current,
      forecast
    };
  }

  private processForecastData(forecastData: any): DailyForecast[] {
    const dailyForecasts: { [key: string]: any[] } = {};
    
    // Group forecasts by day
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = [];
      }
      dailyForecasts[dateKey].push(item);
    });

    // Process each day
    const processedForecasts: DailyForecast[] = [];
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
    Object.keys(dailyForecasts).slice(0, 3).forEach((dateKey, index) => {
      const dayForecasts = dailyForecasts[dateKey];
      const date = new Date(dateKey);
      
      // Get morning (around 9am) and afternoon (around 3pm) forecasts
      const morning = this.findClosestForecast(dayForecasts, 9);
      const afternoon = this.findClosestForecast(dayForecasts, 15);
      
      const moonPhases = ['Nouvelle lune', 'Premier quartier', 'Pleine lune', 'Dernier quartier'];
      const moonPhase = moonPhases[index % moonPhases.length];

      processedForecasts.push({
        date: dateKey,
        dayName: daysOfWeek[date.getDay()],
        morning: {
          temperature: Math.round(morning.main.temp),
          description: morning.weather[0].description,
          icon: morning.weather[0].icon
        },
        afternoon: {
          temperature: Math.round(afternoon.main.temp),
          description: afternoon.weather[0].description,
          icon: afternoon.weather[0].icon
        },
        moonPhase
      });
    });

    return processedForecasts;
  }

  private findClosestForecast(forecasts: any[], targetHour: number): any {
    return forecasts.reduce((closest, forecast) => {
      const forecastHour = new Date(forecast.dt * 1000).getHours();
      const closestHour = new Date(closest.dt * 1000).getHours();
      
      return Math.abs(forecastHour - targetHour) < Math.abs(closestHour - targetHour) 
        ? forecast 
        : closest;
    });
  }

  getWeatherIcon(iconCode: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    
    return iconMap[iconCode] || '🌤️';
  }
}

export const weatherApi = new WeatherApiService();
