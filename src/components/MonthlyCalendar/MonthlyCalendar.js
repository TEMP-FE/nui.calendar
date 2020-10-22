import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './MonthlyCalendar.module.scss'
import { getMonthInfo, getDateInfo, calcWeekCount } from '../../utils/calendar'
import CalendarItem from '../CalendarItem/CalendarItem'
import ButtonArea from '../ButtonArea/ButtonArea'

const cx = classNames.bind(styles)

// 달력 헤더
const CalendarHeader = () => {
	const dayOfWeekList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

	return (
		<div className={cx('calendar_header')}>
			{dayOfWeekList.map((dayOfWeekItem, i) => (
				<div
					key={`calendar_header-${i}`}
					className={cx('calendar_header_item', {
						'-holiday': dayOfWeekItem === 'Sun',
					})}
				>
					<span>{dayOfWeekItem}</span>
				</div>
			))}
		</div>
	)
}

// 달력 셀
const CalendarCell = ({ dateTime, isHoliday, isDimmed }) => {
	const { year, month, date } = getDateInfo(dateTime)

	const onClickCell = () => {
		console.log(year, month, date)
	}

	const calendarItemA = {
		title: '테스트',
		startAt: '0606',
		endAt: '0606',
		location: '',
		category: '',
		isAllDay: false,
		isBlocked: false,
		isPrivate: false,
		isRepeatable: false,
	}
	const calendarItemB = {
		title: '테스트',
		startAt: '0606',
		endAt: '0606',
		location: '',
		category: '',
		isAllDay: true,
		isBlocked: false,
		isPrivate: false,
		isRepeatable: false,
	}

	return (
		<div className={cx('calendar_cell')} onClick={onClickCell}>
			<span className={cx('date', { '-holiday': isHoliday, is_dimmed: isDimmed })}>{date}</span>
			{/*<CalendarItem {...calendarItemA} />*/}
			{/*<CalendarItem {...calendarItemB} />*/}
		</div>
	)
}

// 월 달력
const MonthlyCalendar = ({ year , month }) => {
	const currentMonthInfo = getMonthInfo({ year, month })
	const lastMonthInfo = getMonthInfo({ year, month: month - 1 })
	const weekCount = calcWeekCount({ year, month })
	const [dateInfoList, setDateInfoList] = useState()

	// 달력 정보 만들기
	const makeDateInfoList = () => {
		let tempDateInfoList = new Array(weekCount).fill(null).map((_) => [])

		for (let i = 0; i < weekCount; i++) {
			// 첫째주
			if (i === 0) {
				for (let k = 0; k < 7; k++) {
					// 이전달
					if (k < currentMonthInfo.firstDayOfWeek) {
						const dateTime = new Date(
							year,
							month - 1,
							lastMonthInfo.lastDate - currentMonthInfo.firstDayOfWeek + k + 1,
						)
						tempDateInfoList[i].push({ dateTime, isHoliday: dateTime.getDay() === 0 })
					} else {
						const dateTime = new Date(year, month, k - currentMonthInfo.firstDayOfWeek + 1)
						tempDateInfoList[i].push({ dateTime, isHoliday: dateTime.getDay() === 0 })
					}
				}
			} else {
				for (let j = 0; j < 7; j++) {
					const currentDate = 7 - currentMonthInfo.firstDayOfWeek + 1 + j + (i - 1) * 7
					if (currentDate <= currentMonthInfo.lastDate) {
						//이번달
						const dateTime = new Date(year, month, currentDate)
						tempDateInfoList[i].push({ dateTime, isHoliday: dateTime.getDay() === 0 })
					} else {
						// 다음달
						const dateTime = new Date(year, month + 1, currentDate - currentMonthInfo.lastDate)
						tempDateInfoList[i].push({ dateTime, isHoliday: dateTime.getDay() === 0 })
					}
				}
			}
		}
		setDateInfoList(tempDateInfoList)
	}

	useEffect(() => {
		makeDateInfoList()
	}, [])
	return (
		<div className={cx('calendar_wrap')}>
			<div className={cx('calendar_title')}>
				<strong className={cx('calendar_info')}>{`${year} / ${month + 1}`}</strong>
			</div>
			<div className={cx('calendar_area')}>
				<CalendarHeader />
				<div className={cx('calendar_content')}>
					{dateInfoList?.map((dateInfoRow, i) => (
						<div key={`row-${i}`} className={cx('calendar_row')}>
							{dateInfoRow?.map((dateInfoItem) => {
								return (
									<CalendarCell
										key={dateInfoItem.dateTime.getTime()}
										dateTime={dateInfoItem.dateTime}
										isDimmed={dateInfoItem.dateTime.getMonth() !== month}
										isHoliday={dateInfoItem.isHoliday}
									/>
								)
							})}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default MonthlyCalendar
