import React, { useState, useEffect } from 'react'

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="text-white text-8xl font-light tracking-wider select-none">
      {formatTime(time)}
    </div>
  )
}

export default Clock
