import React from 'react'

import Monthly from '../components/MonthlyCalendar/Monthly'
import WeeklyCalendar from '../components/WeeklyCalendar/WeeklyCalendar'

const CalendarApp = () => {
	const monthlyStyle = {
		width: 600,
	}

	return (
		<>
			{/* <WeeklyCalendar /> */}
			<Monthly style={monthlyStyle} />
		</>
	)
}

export default CalendarApp
