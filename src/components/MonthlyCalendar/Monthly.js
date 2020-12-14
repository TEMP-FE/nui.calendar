import React, { useState, useEffect } from 'react'
import styles from './Monthly.module.scss'
import { getDateInfo } from '../../utils/calendar'
import classNames from 'classnames/bind'

import MonthlyCalendar from '../MonthlyCalendar/MonthlyCalendar'
import ButtonArea from '../ButtonArea/ButtonArea'
import moment from 'moment'

const cx = classNames.bind(styles)

const Monthly = ({ style }) => {
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
		const nextDate = moment()
			.year(year)
			.month(month + count)
		const nextYear = +nextDate.format('YYYY')
		const nextMonth = +nextDate.format('MM') - 1

		setData({
			year: nextYear,
			month: nextMonth,
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
