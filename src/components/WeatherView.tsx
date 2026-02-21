import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeather } from '../hooks/useWeather'
import { weatherApi } from '../services/weatherApi'

const WeatherView: React.FC = () => {
  const navigate = useNavigate()
  const { weather, loading, error } = useWeather()

  const handleBack = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div 
        className="h-screen w-screen orange-diagonal-bg flex items-center justify-center cursor-pointer"
        onClick={handleBack}
      >
        <div className="frosted-glass rounded-3xl p-8 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="text-white text-center">
            <div className="text-3xl font-bold mb-4">Chargement...</div>
            <div className="text-lg opacity-75">Récupération des données météo</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div 
        className="h-screen w-screen orange-diagonal-bg flex items-center justify-center cursor-pointer"
        onClick={handleBack}
      >
        <div className="frosted-glass rounded-3xl p-8 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="text-white text-center">
            <div className="text-3xl font-bold mb-4">Erreur</div>
            <div className="text-lg opacity-75 mb-4">{error || 'Impossible de charger les données météo'}</div>
            <div className="text-sm opacity-75">Cliquez n'importe où pour revenir</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="h-screen w-screen orange-diagonal-bg flex items-center justify-center cursor-pointer"
      onClick={handleBack}
    >
      <div className="frosted-glass rounded-3xl p-8 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-white">
          <div className="text-center mb-8">
            <div className="text-3xl font-bold">Prévisions Météo</div>
            <div className="text-lg opacity-75">{weather.location}</div>
            <div className="text-5xl my-4">
              {weatherApi.getWeatherIcon(weather.current.icon)}
            </div>
            <div className="text-2xl font-medium">{weather.current.temperature}°C</div>
            <div className="text-lg opacity-75 capitalize">{weather.current.description}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {weather.forecast.map((dayData, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <div className="text-3xl mb-2">
                    {weatherApi.getWeatherIcon(dayData.morning.icon)}
                  </div>
                </div>
                
                <div className="text-xl font-semibold mb-4">{dayData.dayName}</div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-75">matin</span>
                    <span className="text-lg font-medium">{dayData.morning.temperature}°</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-75">après-midi</span>
                    <span className="text-lg font-medium">{dayData.afternoon.temperature}°</span>
                  </div>
                  
                  {dayData.moonPhase && (
                    <div className="flex items-center justify-center mt-4 pt-3 border-t border-white/30">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                      </svg>
                      <span className="text-sm">{dayData.moonPhase}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center text-sm opacity-75">
            Cliquez n'importe où pour revenir
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherView
