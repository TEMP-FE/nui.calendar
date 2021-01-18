import React from 'react'
import Monthly from '../MonthlyCalendar/Monthly'
import { AppContext } from '../../contexts/calendar'

const MonthlyLib = () => {
	return (
		<AppContext>
			<Monthly></Monthly>
		</AppContext>
	)
}

export default MonthlyLib
