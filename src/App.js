import React from 'react'

import { AppContext } from './contexts/calendar'

import MonthlyCalendar from './components/MonthlyCalendar/MonthlyCalendar'
import WeeklyPage from './pages/weekly'

import './App.css'

function App() {
	return (
		<AppContext>
			<div className="App">
				<MonthlyCalendar month={10} year={20} />
				<WeeklyPage />
			</div>
		</AppContext>
	)
}

export default App
