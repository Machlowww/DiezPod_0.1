import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCalendar } from '../hooks/useCalendar'
import { simpleGoogleCalendarApi } from '../services/simpleGoogleCalendarApi'

const CalendarView: React.FC = () => {
  const navigate = useNavigate()
  const { calendarDay, loading, error } = useCalendar()

  const handleBack = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div 
        className="h-screen w-screen orange-diagonal-bg flex items-center justify-center cursor-pointer"
        onClick={handleBack}
      >
        <div className="frosted-glass rounded-3xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="text-white text-center">
            <div className="text-6xl font-bold mb-2">...</div>
            <div className="text-2xl font-light mb-8">Chargement...</div>
            <div className="text-lg opacity-75">Récupération des événements</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !calendarDay) {
    return (
      <div 
        className="h-screen w-screen orange-diagonal-bg flex items-center justify-center cursor-pointer"
        onClick={handleBack}
      >
        <div className="frosted-glass rounded-3xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="text-white text-center">
            <div className="text-6xl font-bold mb-2">⚠️</div>
            <div className="text-2xl font-light mb-8">Erreur</div>
            <div className="text-lg opacity-75 mb-4">
              {error || 'Impossible de charger les événements'}
            </div>
            {error && (
              <div className="text-xs opacity-50 mb-4 break-words">
                Détails: {error}
              </div>
            )}
            <div className="text-sm opacity-75">
              Cliquez n'importe où pour revenir
            </div>
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
      <div className="frosted-glass rounded-3xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-white text-center">
          <div className="text-6xl font-bold mb-2">{calendarDay.dayNumber}</div>
          <div className="text-2xl font-light mb-8">
            {calendarDay.dayName} {calendarDay.dayNumber} {calendarDay.monthName}
          </div>
          
          <div className="space-y-4 text-left">
            <div className="border-t border-white/30 pt-4">
              <div className="text-lg font-medium mb-2">
                Événements du jour ({calendarDay.events.length})
              </div>
              <div className="space-y-2">
                {calendarDay.events.length === 0 ? (
                  <div className="text-sm opacity-75 py-2">Aucun événement aujourd'hui</div>
                ) : (
                  calendarDay.events.map((event) => (
                    <div key={event.id} className="py-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{event.summary}</div>
                          {event.location && (
                            <div className="text-xs opacity-75 mt-1">📍 {event.location}</div>
                          )}
                          {event.description && (
                            <div className="text-xs opacity-75 mt-1">
                              {simpleGoogleCalendarApi.formatEventDescription(event)}
                            </div>
                          )}
                        </div>
                        <div className="text-xs opacity-75 ml-2">
                          {simpleGoogleCalendarApi.formatEventTime(event)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-sm opacity-75">
            Cliquez n'importe où pour revenir
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
