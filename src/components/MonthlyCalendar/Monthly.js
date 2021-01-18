import React, { useState, useEffect } from 'react'
import styles from './Monthly.module.scss'
import classNames from 'classnames/bind'

import CalendarDate from '../../utils/CalendarDate'

import MonthlyCalendar from '../MonthlyCalendar/MonthlyCalendar'
import ButtonArea from '../ButtonArea/ButtonArea'

const cx = classNames.bind(styles)

const Monthly = ({ style }) => {
	const currentMonth = new CalendarDate()

	const [monthlyData, setMonthlyData] = useState(null)

	const getThisMonth = () => {
		setMonthlyData(currentMonth)
	}

	useEffect(() => {
		const initialState = new CalendarDate(currentMonth.CURRENT_DATE)

		setMonthlyData(initialState)
	}, [])

	const changeMonth = (state) => {
		let isSetNext = state ? 1 : -1

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
