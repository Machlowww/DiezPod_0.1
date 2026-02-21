import { useNavigate } from 'react-router-dom'
import Clock from './Clock'
import DateDisplay from './DateDisplay'
import WeatherDisplay from './WeatherDisplay'

const MainScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="h-screen w-screen orange-diagonal-bg flex items-center justify-center relative">
      <Clock />
      <DateDisplay onClick={() => navigate('/calendar')} />
      <WeatherDisplay onClick={() => navigate('/weather')} />
    </div>
  )
}

export default MainScreen
