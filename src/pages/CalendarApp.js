import React from 'react'

import Monthly from '../components/MonthlyCalendar/Monthly'
import WeeklyCalendar from '../components/WeeklyCalendar/WeeklyCalendar'
import Calendar from '../components/Calendar'

const CalendarApp = () => {
	const monthlyStyle = {
		width: 1000,
	}

	return (
		<>
			<Calendar calendar={<WeeklyCalendar />} />
			<Calendar calendar={<Monthly style={monthlyStyle} />} />
		</>
	)
}

export default CalendarApp
