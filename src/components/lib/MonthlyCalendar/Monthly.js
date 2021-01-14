import React, { useState, useEffect } from 'react'

import MonthlyCalendar from '../MonthlyCalendar/MonthlyCalendar'
import ButtonArea from '../../ButtonArea/ButtonArea'
import { getDateInfo } from '../../../utils/calendar'
import { useCalendarContext } from '../../../contexts/calendar'

const Monthly = ({ style }) => {
	const { calendarStore } = useCalendarContext()
	console.log(calendarStore)

	const [monthlyData, setData] = useState({
		month: '',
		year: '',
	})

	const getThisMonth = () => {
		setData({
			month: getDateInfo().month,
			year: getDateInfo().year,
		})
	}

	const changeMonth = (state) => {
		let count = state ? 1 : -1
		const { year, month } = monthlyData
		const nextMonthlyData = getDateInfo(new Date(year, month + count))

		setData({
			year: nextMonthlyData.year,
			month: nextMonthlyData.month,
		})
	}

	useEffect(() => {
		getThisMonth()
	}, [])

	return (
		<>
			{monthlyData.year !== '' && monthlyData.month !== '' && (
				<>
					<ButtonArea getThis={getThisMonth} getChange={changeMonth} />
					<div style={style}>
						<MonthlyCalendar month={monthlyData.month} year={monthlyData.year} />
					</div>
				</>
			)}
		</>
	)
}

export default Monthly
