import React, { useState, useEffect } from 'react'
import styles from './Monthly.module.scss'
import { getDateInfo } from '../../utils/calendar'
import classNames from 'classnames/bind'

import MonthlyCalendar from '../MonthlyCalendar/MonthlyCalendar'
import ButtonArea from '../ButtonArea/ButtonArea'

const cx = classNames.bind(styles)

const Monthly = ({}) => {
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
			{monthlyData.year && monthlyData.month && (
				<>
					<ButtonArea getThis={getThisMonth} getChange={changeMonth} />
					<MonthlyCalendar month={monthlyData.month} year={monthlyData.year} />
				</>
			)}
		</>
	)
}

export default Monthly
