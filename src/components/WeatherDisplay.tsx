import React from 'react'
import { useWeather } from '../hooks/useWeather'
import { weatherApi } from '../services/weatherApi'

interface WeatherDisplayProps {
  onClick: () => void
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ onClick }) => {
  const { weather, loading, error } = useWeather()

  if (loading) {
    return (
      <div
        onClick={onClick}
        className="absolute top-8 right-8 frosted-glass rounded-2xl px-6 py-4 cursor-pointer hover:bg-white/30 transition-all duration-300 select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 text-white animate-pulse">⏳</div>
          <span className="text-white text-lg font-medium">Chargement...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        onClick={onClick}
        className="absolute top-8 right-8 frosted-glass rounded-2xl px-6 py-4 cursor-pointer hover:bg-white/30 transition-all duration-300 select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 text-white">⚠️</div>
          <span className="text-white text-lg font-medium">Erreur</span>
        </div>
      </div>
    )
  }

  if (!weather) {
    return null
  }

  const weatherIcon = weather.current.icon ? 
    weatherApi.getWeatherIcon(weather.current.icon) : '🌤️'

  return (
    <div
      onClick={onClick}
      className="absolute top-8 right-8 frosted-glass rounded-2xl px-6 py-4 cursor-pointer hover:bg-white/30 transition-all duration-300 select-none"
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{weatherIcon}</span>
        <span className="text-white text-lg font-medium">
          {weather.current.temperature}° {weather.location}
        </span>
      </div>
    </div>
  )
}

export default WeatherDisplay
