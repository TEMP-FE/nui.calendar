import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames/bind'
import { calendarType } from '../../const/drag'
import { useCalendarContext, useDragDateContext, useDragScheduleContext } from '../../contexts/calendar'
import { setCalendar } from '../../reducers/dragDate'
import { resetScheduleDrag } from '../../reducers/dragSchedule'
import { updateCalendar } from '../../reducers/calendar'
import {
	getMonthInfo,
	getDateInfo,
	calcWeekCount,
	isSameDate,
	calcScheduleDay,
	isDateTimeIncludeScheduleItem,
	getSaturdaysOfMonth,
} from '../../utils/calendar'

import CalendarItem from '../CalendarItem'
import styles from './MonthlyCalendar.module.scss'
import DragDate from '../Drag/DragDate'
import CalendarItemPopupInfo from '../CalendarItem/CalendarItemPopupInfo'
import moment from 'moment'

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
	const { calendarStore } = useCalendarContext()
	const [isEditorShown, setIsEditorShown] = useState(false)

	// TODO: 날짜 형식 YYYY-MM-DD, YYYY-MM-DD-HH:SS 처럼 통일화 필요 (moment.js 활용가능)
	const { date } = getDateInfo(dateTime)
	const dateInfo = moment(dateTime).format('YYYY-MM-DD')
	const calendarList = calendarStore[dateInfo]
	// 셀 클릭 이벤트
	const onCellClick = (e) => {
		e.stopPropagation()

		setIsEditorShown(!isEditorShown)
	}

	const handleEditorClose = () => {
		setIsEditorShown(!isEditorShown)
	}

	// 더보기 버튼 클릭 이벤트
	const onMoreButtonClick = (e) => {
		e.stopPropagation()
		console.log('moreList : ', moreList)
	}

	const filterOverStackSchedule = () => scheduleList.filter((scheduleItem) => scheduleItem.stack > 3)

	useEffect(() => {
		setMoreList(filterOverStackSchedule())
	}, [scheduleList])

	const scheduleEnterStyle = {
		backgroundColor: 'grey',
	}

	return (
		<DragDate className={cx('calendar_cell')} onClick={onCellClick} date={moment(dateTime)}>
			<div className={cx('cell_header')}>
				<span className={cx('date', { '-holiday': isHoliday, is_dimmed: isDimmed })}>{date}</span>
				{moreList && moreList.length > 0 && (
					<button className={cx('more_button')} type={'button'} onClick={onMoreButtonClick}>
						{moreList.length} more
					</button>
				)}
				{calendarList && calendarList.map((item) => <CalendarItem key={item.calendarId} {...item} />)}
				{isEditorShown && (
					<CalendarItemPopupInfo handleClose={handleEditorClose} startAt={dateTime} endAt={dateTime} isNew />
				)}
			</div>
		</DragDate>
	)
}

// 월 달력
const MonthlyCalendar = ({ year = getDateInfo().year, month = getDateInfo().month }) => {
	const [scheduleList, setScheduleList] = useState([])
	const [calendarScheduleList, setCalendarScheduleList] = useState()
	const [dateInfoList, setDateInfoList] = useState()
	const { calendarStore, calendarDispatch } = useCalendarContext()
	const [draggingRenderList, setDraggingRenderList] = useState([])
	let currentMonthInfo = getMonthInfo({ year, month: month + 1 })
	let weekCount = calcWeekCount({ year, month: month + 1 })
	const { dragDateStore, dragDateDispatch } = useDragDateContext()
	const { dragScheduleStore, dragScheduleDispatch } = useDragScheduleContext()
	const calendarContentRef = useRef(null)
	useEffect(() => {
		if (dragScheduleStore.isResizing) {
			let resizingSchedule = calendarStore.scheduleList[dragScheduleStore.dragInfo.index]
			resizingSchedule = {
				...resizingSchedule,
				endAt: dragScheduleStore.dragInfo.endAt.toDate(),
			}
			calendarDispatch(updateCalendar(resizingSchedule))
		}
	}, [dragScheduleStore.dragInfo.endAt])

	useEffect(() => {
		if (dragScheduleStore.isDropped) {
			let movedSchedule = calendarStore.scheduleList[dragScheduleStore.dragInfo.index]
			movedSchedule = {
				...movedSchedule,
				startAt: dragScheduleStore.dragInfo.startAt.toDate(),
				endAt: dragScheduleStore.dragInfo.endAt.toDate(),
			}
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

	// 현재 선택된 '달' 달력 정보 만들기
	const makeDateInfoList = () => {
		const newDateInfoList = new Array(weekCount).fill(null).map((_) => [])
		for (let i = 0; i < weekCount; i++) {
			for (let j = 0; j < 7; j++) {
				const date = 1 - currentMonthInfo.firstDayOfWeek + j + i * 7
				const dateTime = moment().year(year).month(month).date(date)

				const dateInfo = {
					dateTime,
					isHoliday: j === 0,
					scheduleList: Array(0),
					stack: 0,
				}

				newDateInfoList[i].push(dateInfo)
			}
		}

		return newDateInfoList
	}

	// 현재 선택된 '달'의 달력에 맞는 scheduleList 를 만드는 함수
	const getNewScheduleList = (scheduleList, dateInfoList) =>
		ascendingScheduleList(scheduleList).map((scheduleItem, scheduleIndex) => {
			scheduleItem = {
				...scheduleItem,
				index: scheduleIndex,
				scheduleStartAt: scheduleItem.startAt,
				scheduleEndAt: scheduleItem.endAt,
			}

			let period = calcScheduleDay(scheduleItem)
			let renderList = []

			for (let i = 0; i < weekCount; i++) {
				for (let j = 0; j < 7; j++) {
					if (isDateTimeIncludeScheduleItem(dateInfoList[i][j].dateTime, scheduleItem)) {
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
								if (iPos < weekCount) {
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
							const top = `calc(${(100 / weekCount) * i}% + ${stack - 1}*28px + 25px )`
							const left = `calc(${14.29 * j}% + 10px)`

							// 현재 선택된 달 일정만 계산
							if (i < weekCount) {
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
											scheduleIndex === dragScheduleStore.dragInfo.index && { opacity: 0.5 },
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
											scheduleIndex === dragScheduleStore.dragInfo.index && { opacity: 0.5 },
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
						console.log(renderList)
						return {
							...scheduleItem,
							renderList,
						}
					}
				}
			}
		})

	// 먼저 시작하는 일정 순서로 정렬
	const ascendingScheduleList = (scheduleList) => scheduleList.sort((a, b) => moment(a.startAt).diff(b.startAt))

	const makeDraggingRenderList = () => {
		let tempList = []
		const firstWeekOfMonth = moment().year(year).month(month).startOf('month').week()
		dragDateStore.renderList.forEach((duration) => {
			let nthWeek = duration.startAt.week() - firstWeekOfMonth
			if (nthWeek < 0) {
				const prevWeekNumber = duration.startAt.clone().weekday(0).subtract(1, 'day').week()
				nthWeek = prevWeekNumber - firstWeekOfMonth + 1
			}
			const top = `${(100 / weekCount) * nthWeek}%`
			const left = `${14.29 * duration.startAt.day()}%`
			const width = `${14.29 * (duration.endAt.diff(duration.startAt, 'days') + 1)}%`
			const height = `${600 / weekCount}px`
			tempList.push({ top, left, width, height })
		})
		setDraggingRenderList(tempList)
	}

	useEffect(() => {
		const saturdayList = getSaturdaysOfMonth(year, month)
		dragDateDispatch(setCalendar(calendarType.MONTH, saturdayList))
		dragScheduleDispatch(setCalendar(calendarType.MONTH))
	}, [year, month])

	useEffect(() => {
		const newDateInfoList = makeDateInfoList() // 달력정보 만들기
		const newScheduleList = getNewScheduleList(scheduleList, newDateInfoList) // scheduleList 만들기
		setDateInfoList(newDateInfoList)
		setCalendarScheduleList(newScheduleList)
	}, [scheduleList, year, month, dragScheduleStore.dragInfo.index])

	var timer

	const [cursorPos, setCursorPos] = useState({ x: undefined, y: undefined })
	const documentDragOver = (e) => {
		if (!timer) {
			timer = setTimeout(function () {
				timer = null
				setCursorPos({ x: e.clientX, y: e.clientY })
			}, 5)
		}
	}

	useEffect(() => {
		document.addEventListener('dragover', documentDragOver, false)
		return () => {
			document.removeEventListener('dragover', documentDragOver)
		}
	}, [])

	return (
		<div className={cx('calendar_wrap')}>
			<div className={cx('calendar_title')}>
				<strong className={cx('calendar_info')}>{`${year} / ${month + 1}`}</strong>
			</div>
			<div id="calendar" className={cx('calendar_area')}>
				<CalendarHeader />
				<div className={cx('calendar_content')} ref={calendarContentRef}>
					{/* 달력 그리기 */}
					{dateInfoList?.map((dateInfoRow, i) => (
						<div key={`row-${i}`} className={cx('calendar_row')}>
							{dateInfoRow?.map((dateInfoItem, j) => {
								return (
									<CalendarCell
										key={`col-${j}`}
										dateTime={dateInfoItem.dateTime}
										isDimmed={+dateInfoItem.dateTime.format('MM') - 1 !== month}
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

							if (stack < 4) {
								return (
									<div className={cx('schedule_item')} style={{ top, left, width, opacity }}>
										<CalendarItem {...scheduleItem} isLast={isLast} />
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
					{dragScheduleStore.isDragging && !dragScheduleStore.isResizing && (
						<div
							className={cx('dragging_monthly')}
							style={{
								top: cursorPos.y - calendarContentRef.current.offsetTop + 'px',
								left: cursorPos.x - calendarContentRef.current.offsetLeft + 'px',
							}}
						>
							<div className={cx('dragging_monthly_inner')} />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default MonthlyCalendar
