import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainScreen from './components/MainScreen'
import CalendarView from './components/CalendarView'
import WeatherView from './components/WeatherView'

function App() {
  return (
    <Router>
      <div className="h-screen w-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/weather" element={<WeatherView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
