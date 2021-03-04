import React, { useState, useEffect } from 'react'
import moment from 'moment'
import classNames from 'classnames/bind'

import { calendarType } from '../../const/drag'
import { useCalendarContext } from '../../contexts/calendar'
import { setCalendar } from '../../reducers/dragDate'
import { resetScheduleDrag } from '../../reducers/dragSchedule'
import { updateCalendar } from '../../reducers/calendar'

import CalendarDate from '../../utils/CalendarDate'

import DragDate from '../Drag/DragDate'
import CalendarItemPopupInfo from '../CalendarItem/CalendarItemPopupInfo'

import styles from './MonthlyCalendar.module.scss'
import CalendarItemWithPopup from '../CalendarItem/CalendarItemWithPopup'
import { useDragDateContext, useDragScheduleContext } from '../../contexts/drag'

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
const CalendarCell = ({ dateTime, isHoliday, isDimmed, scheduleList }) => {
	const [moreList, setMoreList] = useState()
	const { year, month, date } = CalendarDate.getDateInfo(dateTime)

	const currentDate = moment(`${year}-${month}-${date}`)
	const [popupInfo, setPopupInfo] = useState({ startAt: currentDate, endAt: currentDate, isPopupShown: false })

	const openPopup = (start = currentDate, end = currentDate) =>
		setPopupInfo({ startAt: start, endAt: end, isPopupShown: true })
	const closePopup = () => setPopupInfo({ ...popupInfo, isPopupShown: false })

	// 더보기 버튼 클릭 이벤트
	const onMoreButtonClick = (e) => {
		e.stopPropagation()
	}

	const filterOverStackSchedule = () => scheduleList.filter((scheduleItem) => scheduleItem.stack > 3)

	useEffect(() => {
		setMoreList(filterOverStackSchedule())
	}, [scheduleList])

	return (
		<DragDate className={cx('calendar_cell')} openPopup={openPopup} date={moment(dateTime)}>
			<div id={`cell-${month}-${date}`} className={cx('cell_header')}>
				<span className={cx('date', { '-holiday': isHoliday, is_dimmed: isDimmed })}>{date}</span>
				{moreList && moreList.length > 0 && (
					<button className={cx('more_button')} type={'button'} onClick={onMoreButtonClick}>
						{moreList.length} more
					</button>
				)}
				{popupInfo.isPopupShown && (
					<CalendarItemPopupInfo
						id={`cell-${month}-${date}`}
						handleClose={closePopup}
						schedule={{
							startAt: popupInfo.startAt,
							endAt: popupInfo.endAt,
						}}
						isNew
					/>
				)}
			</div>
		</DragDate>
	)
}

// 월 달력
const MonthlyCalendar = ({ year, month }) => {
	const [scheduleList, setScheduleList] = useState([])
	const [calendarScheduleList, setCalendarScheduleList] = useState()
	const [dateInfoList, setDateInfoList] = useState()
	const { calendarStore, calendarDispatch } = useCalendarContext()
	const [draggingRenderList, setDraggingRenderList] = useState([])

	let weekLength = CalendarDate.getWeekLength({ year, month: month })

	const { dragDateStore, dragDateDispatch } = useDragDateContext()
	const { dragScheduleStore, dragScheduleDispatch } = useDragScheduleContext()

	useEffect(() => {
		if (dragScheduleStore.isResizing) {
			let resizingSchedule = calendarStore.scheduleList.find(schedule => schedule.scheduleId === dragScheduleStore.dragInfo.scheduleId)
			resizingSchedule = {
				...resizingSchedule,
				endAt: dragScheduleStore.dragInfo.endAt,
			}
			console.log(resizingSchedule)
			calendarDispatch(updateCalendar(resizingSchedule))
		}
	}, [dragScheduleStore.dragInfo.endAt])

	useEffect(() => {
		if (dragScheduleStore.isDropped) {
			let movedSchedule = calendarStore.scheduleList.find(schedule => schedule.scheduleId === dragScheduleStore.dragInfo.scheduleId)
			movedSchedule = {
				...movedSchedule,
				startAt: dragScheduleStore.dragInfo.startAt,
				endAt: dragScheduleStore.dragInfo.endAt,
			}
			console.log(movedSchedule)
			calendarDispatch(updateCalendar(movedSchedule))
			dragScheduleDispatch(resetScheduleDrag())
		}
	}, [dragScheduleStore.isDropped])

	useEffect(() => {
		setScheduleList(calendarStore.scheduleList)
	}, [calendarStore.scheduleList])

	useEffect(() => {
		makeDraggingRenderList()
	}, [dragDateStore.renderList])

	// 현재 선택된 '달'의 달력에 맞는 scheduleList 를 만드는 함수
	const getNewScheduleList = (scheduleList, dateInfoList) =>
		ascendingScheduleList(scheduleList).map((scheduleItem) => {

			let period = CalendarDate.calcScheduleTimeToUnix(scheduleItem)
			let renderList = []

			for (let i = 0; i < weekLength; i++) {
				for (let j = 0; j < 7; j++) {
					if (scheduleItem.isIncluded(dateInfoList[i][j].dateTime)) {
						// 전체 기간에서 이전달 달력에 그려지는 기간 빼기

						// 일정을 넣을 수 있는 stack 값 찾기
						let stack = 1
						let isPossible = false

						while (!isPossible) {
							for (let p = 0; p < period; p++) {
								const num = i * 7 + j + p
								const iPos = Math.floor(num / 7)
								const jPos = num % 7

								// 이번 달 일정만 계산
								if (iPos < weekLength) {
									if (
										dateInfoList[iPos][jPos].scheduleList.filter(
											(scheduleItem) => scheduleItem.stack === stack,
										).length
									) {
										stack++
										break
									}
									if (p === period - 1) {
										isPossible = true
									}
								} else {
									isPossible = true
								}
							}
						}

						//
						while (period > 0) {
							const top = `calc(${(100 / weekLength) * i}% + ${stack - 1}*28px + 25px )`
							const left = `calc(${14.29 * j}% + 10px)`

							// 현재 선택된 달 일정만 계산
							if (i < weekLength) {
								if (7 - j < period) {
									// 스택 업데이트
									for (let k = j; k < 7; k++) {
										dateInfoList[i][k].scheduleList.push({ ...scheduleItem, stack })
										dateInfoList[i][k].stack = stack
									}

									const width = `calc(${14.29 * (7 - j)}% - 20px)`
									renderList.push(
										Object.assign(
											{ top, left, width, stack },
											scheduleItem.scheduleId === dragScheduleStore.dragInfo.scheduleId && { opacity: 0.5 },
										),
									)
									period = period - (7 - j)
								} else {
									// 스택 업데이트
									for (let k = j; k < j + period; k++) {
										// 다음달 일정
										dateInfoList[i][k].scheduleList.push({ ...scheduleItem, stack })
										dateInfoList[i][k].stack = stack
									}

									const width = `calc(${period * 14.29}% - 20px)`
									renderList.push(
										Object.assign(
											{ top, left, width, stack },
											scheduleItem.scheduleId === dragScheduleStore.dragInfo.scheduleId && { opacity: 0.5 },
										),
									)
									period = 0
								}
							} else {
								period = 0
							}
							i++
							j = 0
						}
						renderList[renderList.length - 1] = { ...renderList[renderList.length - 1], isLast: true }
						return {
							...scheduleItem,
							renderList,
						}
					}
				}
			}
		})

	// 먼저 시작하는 일정 순서로 정렬
	const ascendingScheduleList = (scheduleList) => scheduleList.sort((a, b) => a.startAt - b.startAt)

	const makeDraggingRenderList = () => {
		let tempList = []
		const firstWeekOfMonth = moment()
			.year(year)
			.month(month - 1)
			.startOf('month')
			.week()
		dragDateStore.renderList.forEach((duration) => {
			let nthWeek = duration.startAt.week() - firstWeekOfMonth
			if (nthWeek < 0) {
				const prevWeekNumber = duration.startAt.clone().weekday(0).subtract(1, 'day').week()
				nthWeek = prevWeekNumber - firstWeekOfMonth + 1
			}
			const top = `${(100 / weekLength) * nthWeek}%`
			const left = `${14.29 * duration.startAt.day()}%`
			const width = `${14.29 * (duration.endAt.diff(duration.startAt, 'days') + 1)}%`
			const height = `${600 / weekLength}px`
			tempList.push({ top, left, width, height })
		})
		setDraggingRenderList(tempList)
	}

	useEffect(() => {
		const saturdayList = CalendarDate.getSaturdaysOfMonth({ year, month })

		dragDateDispatch(setCalendar(calendarType.MONTH, saturdayList))
		dragScheduleDispatch(setCalendar(calendarType.MONTH))
	}, [year, month])

	useEffect(() => {
		const newDateInfoList = CalendarDate.getMonthInfoList({ year, month }) // 달력정보 만들기
		const newScheduleList = getNewScheduleList(scheduleList, newDateInfoList) // scheduleList 만들기

		setDateInfoList(newDateInfoList)
		setCalendarScheduleList(newScheduleList)
	}, [scheduleList, year, month, dragScheduleStore.dragInfo.scheduleId])

	return (
		<div className={cx('calendar_wrap')}>
			<div className={cx('calendar_title')}>
				<strong className={cx('calendar_info')}>{`${year} / ${month}`}</strong>
			</div>
			<div id="calendar" className={cx('calendar_area')}>
				<CalendarHeader />
				<div className={cx('calendar_content')}>
					{/* 달력 그리기 */}
					{dateInfoList?.map((dateInfoRow, i) => (
						<div key={`row-${i}`} className={cx('calendar_row')}>
							{dateInfoRow?.map((dateInfoItem, j) => {
								return (
									<CalendarCell
										key={dateInfoItem.dateTime}
										dateTime={dateInfoItem.dateTime}
										isDimmed={dateInfoItem.dateTime.month() + 1 !== month}
										isHoliday={dateInfoItem.isHoliday}
										scheduleList={dateInfoItem.scheduleList}
									/>
								)
							})}
						</div>
					))}

					{/* 일정 그리기  */}
					{calendarScheduleList?.map((scheduleItem) => {
						return scheduleItem?.renderList?.map((renderItem) => {
							const { top, left, width, stack, opacity, isLast } = renderItem
							const { month, date } = CalendarDate.getDateInfo(scheduleItem.startAt)

							if (stack < 4) {
								return (
									<div
										key={scheduleItem.scheduleId}
										className={cx('schedule_item')}
										style={{ top, left, width, opacity }}
									>
										<CalendarItemWithPopup
											id={`cell-${month}-${date}`}
											isLast={isLast}
											schedule={scheduleItem}
										/>
									</div>
								)
							}
						})
					})}
					{draggingRenderList?.map((renderItem) => {
						const { top, left, width, height } = renderItem
						return (
							<div
								style={{
									top,
									left,
									width,
									height,
									backgroundColor: 'rgba(255,0,0,0.1)',
									position: 'absolute',
									zIndex: '-1',
								}}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default MonthlyCalendar
