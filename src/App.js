import React from 'react'
import { AppContext } from './contexts/calendar'

import MonthlyCalendar from './components/MonthlyCalendar/MonthlyCalendar'
import WeeklyCalendar from './components/WeeklyCalendar/WeeklyCalendar'

import './App.css'

function App() {
	return (
		<AppContext>
			<div className="App">
        <MonthlyCalendar month={10} year={2020} />
  			<WeeklyCalendar />
			</div>
		</AppContext>
	)
}

export default App
