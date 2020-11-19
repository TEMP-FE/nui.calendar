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
		if (state) {
			monthlyData.month === 11
				? setData({
						month: 0,
						year: monthlyData.year + 1,
				  })
				: setData({
						...monthlyData,
						month: monthlyData.month + 1,
				  })
		} else {
			monthlyData.month === 0
				? setData({
						month: 11,
						year: monthlyData.year - 1,
				  })
				: setData({
						...monthlyData,
						month: monthlyData.month - 1,
				  })
		}
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
