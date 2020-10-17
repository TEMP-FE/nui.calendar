import React from 'react'
import logo from './logo.svg'
import './App.css'
import MonthlyCalendar from './components/MonthlyCalendar/MonthlyCalendar'
import WeeklyPage from './pages/weekly'

function App() {
	return (
		<div className="App">
			<MonthlyCalendar month={10} year={2020} />
			<WeeklyPage />
		</div>
	)
}

export default App
