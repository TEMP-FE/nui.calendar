import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import styles from './MonthlyCalendar.module.scss'
import { getMonthInfo, getDateInfo, calcWeekCount, isSameDate, calcScheduleDay } from '../../utils/calendar'
import CalendarItem from '../CalendarItem/CalendarItem'

const cx = classNames.bind(styles)

const DEMO_PROPS = {
	scheduleList: [
		{
			title: '일정 1',
			startAt: new Date(2020, 9, 1),
			endAt: new Date(2020, 9, 2),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '일정 2',
			startAt: new Date(2020, 9, 19),
			endAt: new Date(2020, 9, 20),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '일정 3',
			startAt: new Date(2020, 9, 30),
			endAt: new Date(2020, 9, 31),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '일정 4',
			startAt: new Date(2020, 9, 12),
			endAt: new Date(2020, 9, 15),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '일정 5',
			startAt: new Date(2020, 9, 13),
			endAt: new Date(2020, 9, 14),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '일정 6',
			startAt: new Date(2020, 9, 14),
			endAt: new Date(2020, 9, 15),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '일정 7',
			startAt: new Date(2020, 9, 15),
			endAt: new Date(2020, 9, 15),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
	],
}

// 일정스택 확인 변수
let scheduleStack = []

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
const CalendarCell = ({ dateTime, isHoliday, isDimmed, scheduleList }) => {
	const { year, month, date } = getDateInfo(dateTime)

	// 셀 클릭 이벤트
	const onClickCell = () => {
		console.log(year, month, date)
	}
	return (
		<div className={cx('calendar_cell')} onClick={onClickCell}>
			<span className={cx('date', { '-holiday': isHoliday, is_dimmed: isDimmed })}>{date}</span>
			{scheduleList.map((scheduleItem, i) => {
				const startAt = getDateInfo(scheduleItem.startAt)
				const endAt = getDateInfo(scheduleItem.endAt)
				const startAtString = `${startAt.year}/${startAt.month}/${startAt.date}`
				const endAtString = `${endAt.year}/${endAt.month}/${endAt.date}`

				const period = calcScheduleDay(scheduleItem)
				const width = `calc(${period * 100}% - 20px)` // 스케줄 너비
				const currentStack = scheduleStack[startAtString] ? scheduleStack[startAtString] + 1 : 1

				// startAt 부터 endAt 까지 현재 스택 값으로 변경
				for (let j = 0; j < period; j++) {
					const dateString = `${startAt.year}/${startAt.month}/${startAt.date + j}`
					scheduleStack[dateString] = currentStack
				}

				// 스택 값에 맞게 높이 설정
				const top = 25 + (scheduleStack[startAtString] - 1) * (25 + 5)

				return (
					<div className={cx('schedule_item')} style={{ top, width }}>
						<CalendarItem {...scheduleItem} startAt={startAtString} endAt={endAtString} />
					</div>
				)
			})}
		</div>
	)
}

// 월 달력
const MonthlyCalendar = ({ year = getDateInfo().year, month = getDateInfo().month }) => {
	const { scheduleList } = DEMO_PROPS
	const currentMonthInfo = getMonthInfo({ year, month })
	const weekCount = calcWeekCount({ year, month })
	const [dateInfoList, setDateInfoList] = useState()

	// 달력 정보 만들기
	const makeDateInfoList = () => {
		let tempDateInfoList = new Array(weekCount).fill(null).map((_) => [])

		for (let i = 0; i < weekCount; i++) {
			for (let j = 0; j < 7; j++) {
				const date = 1 - currentMonthInfo.firstDayOfWeek + j + i * 7
				const dateTime = new Date(year, month - 1, date)
				const dateInfo = {
					dateTime,
					isHoliday: j === 0,
					scheduleList: scheduleList.filter((scheduleItem) => isSameDate(scheduleItem.startAt, dateTime)),
				}

				tempDateInfoList[i].push(dateInfo)
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
				<strong className={cx('calendar_info')}>{`${year} / ${month}`}</strong>
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
										isDimmed={dateInfoItem.dateTime.getMonth() !== month - 1}
										isHoliday={dateInfoItem.isHoliday}
										scheduleList={dateInfoItem.scheduleList}
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
