import React from 'react'
import logo from './logo.svg'
import './App.css'
import Monthly from './components/MonthlyCalendar/Monthly'
import WeeklyCalendar from './components/WeeklyCalendar/WeeklyCalendar'

function App() {
	return (
		<div className="App">
			<Monthly />
			<WeeklyCalendar />
		</div>
	)
}

export default App
