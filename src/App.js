import React from 'react'

import { AppContext } from './contexts/calendar'

import './App.css'
import CalendarApp from './pages/CalendarApp'

function App() {
	return (
		<AppContext>
			<CalendarApp />
		</AppContext>
	)
}

export default App
