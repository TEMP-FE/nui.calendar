import React from 'react'
import Monthly from '../MonthlyCalendar/Monthly'
import { AppContext } from '../../contexts/calendar'
import Calendar from '../Calendar'

const MonthlyLib = ({ scheduleList }) => {
	return (
		<AppContext>
			<Calendar calendar={<Monthly scheduleList={scheduleList} />} />
		</AppContext>
	)
}

export default MonthlyLib
