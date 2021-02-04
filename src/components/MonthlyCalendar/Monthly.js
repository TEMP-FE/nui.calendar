import React, { useState, useEffect } from 'react'

import CalendarDate from '../../utils/CalendarDate'

import MonthlyCalendar from '../MonthlyCalendar/MonthlyCalendar'
import ButtonArea from '../ButtonArea/ButtonArea'
import { useCalendarContext } from '../../contexts/calendar'
import { setCalendar } from '../../reducers/calendar'
import Schedule from '../../utils/Schedule'

const Monthly = ({ style, scheduleList }) => {
	const { calendarDispatch } = useCalendarContext()

	const currentMonth = new CalendarDate()

	const [monthlyData, setMonthlyData] = useState(null)

	const getThisMonth = () => {
		setMonthlyData(currentMonth)
	}

	useEffect(() => {
		if (scheduleList) {
			const action = setCalendar(scheduleList.map((scheduleItem) => new Schedule(scheduleItem)))
			calendarDispatch(action)
		}
	}, [scheduleList])

	useEffect(() => {
		const initialState = new CalendarDate(currentMonth.CURRENT_DATE)

		setMonthlyData(initialState)
	}, [])

	const changeMonth = (isSetNext) => {
		const nextMonthlyData = new CalendarDate(monthlyData.CURRENT_DATE)

		if (isSetNext) {
			nextMonthlyData.setNextMonth()
		} else {
			nextMonthlyData.setPrevMonth()
		}

		setMonthlyData(nextMonthlyData)
	}

	return (
		<>
			{monthlyData && (
				<>
					<ButtonArea getThis={getThisMonth} getChange={changeMonth} />
					<div id="calendar-container" style={style}>
						<MonthlyCalendar year={monthlyData.YEAR} month={monthlyData.MONTH} />
					</div>
				</>
			)}
		</>
	)
}

export default Monthly
