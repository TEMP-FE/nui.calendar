import React, { useState, useEffect } from 'react'

import moment from 'moment'
import classNames from 'classnames/bind'
import { getMonthInfo, getDateInfo, calcWeekCount } from '../../utils/calendar'
import { useCalenderContext } from '../../contexts/calendar'

import CalendarItem from '../CalendarItem'

import styles from './MonthlyCalendar.module.scss'
import CalendarItemPopupEditor from '../CalendarItem/CalendarItemPopupEditor'

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
	const { calendarStore } = useCalenderContext()
	const [isEditorShown, setIsEditorShown] = useState(false)

	// TODO: 날짜 형식 YYYY-MM-DD, YYYY-MM-DD-HH:SS 처럼 통일화 필요 (moment.js 활용가능)
	const { year, month, date } = getDateInfo(dateTime)
	const dateInfo = moment(dateTime).format('YYYY-MM-DD')
	const calendarList = calendarStore[dateInfo]

	const onClickCell = (e) => {
		e.stopPropagation()

		console.log(year, month, date)
		setIsEditorShown(!isEditorShown)
	}

	const handleEditorClose = () => {
		setIsEditorShown(!isEditorShown)
	}

	return (
		<div className={cx('calendar_cell')} onClick={onClickCell}>
			<span className={cx('date', { '-holiday': isHoliday, is_dimmed: isDimmed })}>{date}</span>
			{calendarList && calendarList.map((item) => <CalendarItem key={item.calendarId} {...item} />)}
			{isEditorShown && <CalendarItemPopupEditor handleClose={handleEditorClose} dateInfo={dateInfo} />}
		</div>
	)
}

// 월 달력
const MonthlyCalendar = ({ year = getDateInfo().year, month = getDateInfo().month }) => {
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
