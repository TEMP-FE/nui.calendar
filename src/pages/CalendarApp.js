import React from 'react'

import Monthly from '../components/MonthlyCalendar/Monthly'
import WeeklyCalendar from '../components/WeeklyCalendar/WeeklyCalendar'

const CalendarApp = () => {
	return (
		<>
			<WeeklyCalendar />
			<Monthly />
		</>
	)
}

export default CalendarApp
