import React from 'react'

import Monthly from '../components/MonthlyCalendar/Monthly'
import WeeklyCalendar from '../components/WeeklyCalendar/WeeklyCalendar'

const CalendarApp = () => {
	const monthlyStyle = {
		width: 1000,
	}

	return (
		<>
			<WeeklyCalendar />
			<Monthly style={monthlyStyle} />
		</>
	)
}

export default CalendarApp
