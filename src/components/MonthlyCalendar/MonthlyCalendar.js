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
			endAt: new Date(2020, 9, 19),
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
			endAt: new Date(2020, 9, 18),
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
			endAt: new Date(2020, 9, 17),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
	],
}

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
const CalendarCell = ({ dateTime, isHoliday, isDimmed, moreList }) => {
	const { year, month, date } = getDateInfo(dateTime)

	// 셀 클릭 이벤트
	const onClickCell = () => {
		console.log(year, month, date)
	}
	return (
		<div className={cx('calendar_cell')} onClick={onClickCell}>
			<span className={cx('date', { '-holiday': isHoliday, is_dimmed: isDimmed })}>{date}</span>
			{moreList > 0 && <button type={'button'}>{moreList} more</button>}
		</div>
	)
}

// 월 달력
const MonthlyCalendar = ({ year = getDateInfo().year, month = getDateInfo().month }) => {
	const [scheduleList, setScheduleList] = useState(DEMO_PROPS.scheduleList)
	const [dateInfoList, setDateInfoList] = useState()
	const currentMonthInfo = getMonthInfo({ year, month })
	const weekCount = calcWeekCount({ year, month })
	let scheduleStack = new Array(weekCount).fill(null).map((_) => []) // 일정스택 확인 변수

	// 달력 정보 만들기
	const makeDateInfoList = () => {
		const newDateInfoList = new Array(weekCount).fill(null).map((_) => [])
		for (let i = 0; i < weekCount; i++) {
			for (let j = 0; j < 7; j++) {
				const date = 1 - currentMonthInfo.firstDayOfWeek + j + i * 7
				const dateTime = new Date(year, month - 1, date)
				const dateInfo = {
					dateTime,
					isHoliday: j === 0,
				}

				newDateInfoList[i].push(dateInfo)
			}
		}
		setDateInfoList(newDateInfoList)
	}

	// 스케줄 위치 계산
	const calcSchedulePosition = () => {
		const cellPadding = '10px' // 셀 왼쪽 패딩
		const dateHeight = '25px' // 셀 날짜 높이
		const calendarItemHeight = '28px' // 일정 아이템 높이

		setScheduleList(
			scheduleList.map((scheduleItem) => {
				let period = calcScheduleDay(scheduleItem)
				let renderList = []

				for (let i = 0; i < weekCount; i++) {
					for (let j = 0; j < 7; j++) {
						if (isSameDate(dateInfoList[i][j].dateTime, scheduleItem.startAt)) {
							const currentStack = scheduleStack[i][j] ? scheduleStack[i][j] + 1 : 1
							while (period > 0) {
								const top = `calc(${(100 / weekCount) * i}% + ${
									currentStack - 1
								}*${calendarItemHeight} + ${dateHeight} )`
								const left = `calc(${14.29 * j}% + ${cellPadding})`

								if (7 - j < period) {
									// 스택 업데이트
									for (let k = j; k < 7; k++) {
										scheduleStack[i][k] = currentStack
									}

									const width = `calc(${14.29 * (7 - j)}% - 20px)`
									renderList.push({ top, left, width, stack: currentStack })
									period = period - (7 - j)
								} else {
									// 스택 업데이트
									for (let k = j; k < j + period; k++) {
										scheduleStack[i][k] = currentStack
									}

									const width = `calc(${period * 14.29}% - 20px)`
									renderList.push({ top, left, width, stack: currentStack })
									period = 0
								}

								// 스택 업데이트

								i++
								j = 0
							}

							return {
								...scheduleItem,
								renderList,
							}
						}
					}
				}
			}),
		)

		console.log(scheduleStack)
	}

	// 먼저 시작하는 일정 순서로 정렬
	const ascendingScheduleList = () => {
		setScheduleList(scheduleList.sort((a, b) => a.startAt.getTime() - b.startAt.getTime()))
	}

	useEffect(() => {
		makeDateInfoList()
		ascendingScheduleList()
	}, [])

	useEffect(() => {
		if (dateInfoList) {
			calcSchedulePosition()
		}
	}, [dateInfoList])

	useEffect(() => {
		console.log(scheduleList)
	}, [scheduleList])

	return (
		<div className={cx('calendar_wrap')}>
			<div className={cx('calendar_title')}>
				<strong className={cx('calendar_info')}>{`${year} / ${month}`}</strong>
			</div>
			<div className={cx('calendar_area')}>
				<CalendarHeader />
				<div className={cx('calendar_content')}>
					{/* 달력 그리기 */}
					{dateInfoList?.map((dateInfoRow, i) => (
						<div key={`row-${i}`} className={cx('calendar_row')}>
							{dateInfoRow?.map((dateInfoItem, j) => {
								return (
									<CalendarCell
										key={dateInfoItem.dateTime.getTime()}
										dateTime={dateInfoItem.dateTime}
										isDimmed={dateInfoItem.dateTime.getMonth() !== month - 1}
										isHoliday={dateInfoItem.isHoliday}
										moreList={scheduleStack[i][j] - 3}
									/>
								)
							})}
						</div>
					))}

					{/* 일정 그리기  */}
					{scheduleList.map((scheduleItem) => {
						const startAt = getDateInfo(scheduleItem.startAt)
						const endAt = getDateInfo(scheduleItem.endAt)
						const startAtString = `${startAt.year}/${startAt.month}/${startAt.date}`
						const endAtString = `${endAt.year}/${endAt.month}/${endAt.date}`
						return scheduleItem?.renderList?.map((renderItem) => {
							const { top, left, width, stack } = renderItem
							if (stack < 4) {
								return (
									<div className={cx('schedule_item')} style={{ top, left, width }}>
										<CalendarItem {...scheduleItem} startAt={startAtString} endAt={endAtString} />
									</div>
								)
							}
						})
					})}
				</div>
			</div>
		</div>
	)
}

export default MonthlyCalendar
