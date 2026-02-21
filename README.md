# DiezPod - Clock, Calendar & Weather App

A simple and elegant application that combines a clock, calendar, and weather display with ultra-smooth navigation.

## Features

- **Main Screen**: Large clock display with date (bottom-left) and weather (top-right)
- **Calendar View**: Click date to see daily events (Google Calendar integration ready)
- **Weather View**: Click weather to see detailed forecast (OpenWeatherMap integration ready)
- **Ultra-smooth Navigation**: Single-click navigation between all views
- **Modern UI**: Frosted glass effects with animated orange diagonal stripe background
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom frosted glass effects
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **API Integration**: Ready for Google Calendar API and OpenWeatherMap API

## Installation

### Prerequisites

You need to have Node.js installed on your system. Download it from [nodejs.org](https://nodejs.org/).

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

The application is configured with your API keys in the `.env` file:

```
VITE_GOOGLE_CLIENT_ID=150912343817-tvncuq2t0a06l3f3q43r4gqnn6cq937d.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyAJ0W9ZspTkCXtnlTOPfdaMCvkT5a83vB8
VITE_OPENWEATHER_API_KEY=50e6df24f462cb0f57f72e60006cfb37
VITE_DEFAULT_LOCATION=Nantes,FR
```

## Project Structure

```
DiezPod/
├── src/
│   ├── components/
│   │   ├── MainScreen.tsx      # Main screen with clock, date, weather
│   │   ├── Clock.tsx           # Real-time clock display
│   │   ├── DateDisplay.tsx     # Date widget (clickable)
│   │   ├── WeatherDisplay.tsx  # Weather widget (clickable)
│   │   ├── CalendarView.tsx    # Calendar view page
│   │   └── WeatherView.tsx     # Weather view page
│   ├── App.tsx                 # Main application with routing
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles with TailwindCSS
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Usage

- **Main Screen**: Displays current time, date, and weather
- **Click Date**: Opens calendar view showing daily events
- **Click Weather**: Opens weather forecast view
- **Click Anywhere (in views)**: Returns to main screen

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Next Steps

The application is ready for API integration:

1. **Google Calendar Integration**: Connect to your Google Calendar to display real events
2. **Weather API Integration**: Connect to OpenWeatherMap for real weather data
3. **Enhanced Styling**: Add more animations and micro-interactions
4. **Settings Page**: Allow users to customize location, temperature units, etc.

## License

This project is open source and available under the [MIT License](LICENSE).
