import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'

import { useCalendarContext } from '../../contexts/calendar'
import { getMonthInfo, getDateInfo, calcWeekCount, isSameDate, calcScheduleDay } from '../../utils/calendar'

import CalendarItem from '../CalendarItem'
import CalendarItemPopupEditor from '../CalendarItem/CalendarItemPopupEditor'

import styles from './MonthlyCalendar.module.scss'

const cx = classNames.bind(styles)

const _MS_PER_DAY = 1000 * 60 * 60 * 24
const dateDiffInDays = (a, b) => {
	// Discard the time and time-zone information.
	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

	return Math.floor((utc2 - utc1) / _MS_PER_DAY)
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
const CalendarCell = ({ dateTime, isHoliday, isDimmed, scheduleList, changeSchedule }) => {
	const [moreList, setMoreList] = useState()
	const [dragEnter, setDragEnter] = useState(false)
	const [isEditorShown, setIsEditorShown] = useState(false)

	// TODO: 날짜 형식 YYYY-MM-DD, YYYY-MM-DD-HH:SS 처럼 통일화 필요 (moment.js 활용가능)
	const { year, month, date } = getDateInfo(dateTime)
	const startAt = new Date(year, month, date)
	const endAt = new Date(year, month, date)

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

	const handleDragEnter = (e) => {
		setDragEnter(true)
	}

	const handleDragLeave = (e) => {
		setDragEnter(false)
	}

	const handleDragOver = (e) => {
		e.stopPropagation()
		e.preventDefault()
	}

	const handleDrop = (e) => {
		e.preventDefault()
		changeSchedule()
		e.currentTarget.style.backgroundColor = ''
	}

	const filterOverStackSchedule = () => scheduleList.filter((scheduleItem) => scheduleItem.stack > 3)

	useEffect(() => {
		setMoreList(filterOverStackSchedule())
	}, [scheduleList])

	return (
		<div
			className={cx('calendar_cell')}
			onClick={onCellClick}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			style={{ backgroundColor: dragEnter && 'red' }}
		>
			<div className={cx('cell_header')} style={{ pointerEvents: dragEnter && 'none' }}>
				<span className={cx('date', { '-holiday': isHoliday, is_dimmed: isDimmed })}>{date}</span>
				{moreList && moreList.length > 0 && (
					<button className={cx('more_button')} type={'button'} onClick={onMoreButtonClick}>
						{moreList.length} more
					</button>
				)}
				{scheduleList && scheduleList.map((item) => <CalendarItem key={item.calendarId} {...item} />)}
				{isEditorShown && (
					<CalendarItemPopupEditor handleClose={handleEditorClose} startAt={startAt} endAt={endAt} />
				)}
			</div>
		</div>
	)
}

// 월 달력
const MonthlyCalendar = ({ year = getDateInfo().year, month = getDateInfo().month }) => {
	const { calendarStore } = useCalendarContext()
	const [scheduleList, setScheduleList] = useState([])

	useEffect(() => {
		setScheduleList(calendarStore.scheduleList)
	}, [calendarStore.scheduleList])

	const [calendarScheduleList, setCalendarScheduleList] = useState([])
	const [dateInfoList, setDateInfoList] = useState([])

	const [dragging, setDragging] = useState(-1)

	const currentMonthInfo = getMonthInfo({ year, month })
	const weekCount = calcWeekCount({ year, month })

	const changeSchedule = (startAt) => {
		if (dragging < 0) return
		const diffDays = dateDiffInDays(scheduleList[dragging].startAt, scheduleList[dragging].endAt)
		const endAt = new Date(startAt)
		endAt.setDate(startAt.getDate() + diffDays)
		scheduleList[dragging] = { ...scheduleList[dragging], startAt: startAt, endAt: endAt }
		setScheduleList([
			...scheduleList.slice(0, dragging),
			{ ...scheduleList[dragging] },
			...scheduleList.slice(dragging + 1),
		])
	}

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
					scheduleList: Array(0),
					stack: 0,
				}

				newDateInfoList[i].push(dateInfo)
			}
		}

		const newScheduleList = ascendingScheduleList(scheduleList).map((scheduleItem, scheduleIndex) => {
			let period = calcScheduleDay(scheduleItem)
			let renderList = []
			for (let i = 0; i < weekCount; i++) {
				for (let j = 0; j < 7; j++) {
					if (isSameDate(newDateInfoList[i][j].dateTime, scheduleItem.startAt)) {
						// 일정을 넣을 수 있는 stack 값 찾기
						let stack = 1
						let isPossible = false

						while (!isPossible) {
							for (let p = 0; p < period; p++) {
								const num = i * 7 + j + p
								const iPos = Math.floor(num / 7)
								const jPos = num % 7

								if (
									newDateInfoList[iPos][jPos].scheduleList.filter(
										(scheduleItem) => scheduleItem.stack === stack,
									).length
								) {
									stack++
									break
								}
								if (p === period - 1) {
									isPossible = true
								}
							}
						}

						//
						while (period > 0) {
							const top = `calc(${(100 / weekCount) * i}% + ${stack - 1}*28px + 25px )`
							const left = `calc(${14.29 * j}% + 10px)`

							if (7 - j < period) {
								// 스택 업데이트
								for (let k = j; k < 7; k++) {
									newDateInfoList[i][k].scheduleList.push({ ...scheduleItem, stack })
									newDateInfoList[i][k].stack = stack
								}

								const width = `calc(${14.29 * (7 - j)}% - 20px)`
								renderList.push(
									Object.assign(
										{ top, left, width, stack, scheduleIndex },
										scheduleIndex === dragging && { opacity: 0.5 },
									),
								)
								period = period - (7 - j)
							} else {
								// 스택 업데이트
								for (let k = j; k < j + period; k++) {
									newDateInfoList[i][k].scheduleList.push({ ...scheduleItem, stack })
									newDateInfoList[i][k].stack = stack
								}

								const width = `calc(${period * 14.29}% - 20px)`
								renderList.push(
									Object.assign(
										{ top, left, width, stack, scheduleIndex },
										scheduleIndex === dragging && { opacity: 0.5 },
									),
								)
								period = 0
							}

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
		})

		setCalendarScheduleList(newScheduleList)
		setDateInfoList(newDateInfoList)
	}

	// 먼저 시작하는 일정 순서로 정렬
	const ascendingScheduleList = (scheduleList) =>
		scheduleList.sort((a, b) => a.startAt.getTime() - b.startAt.getTime())

	useEffect(() => {
		makeDateInfoList()
	}, [scheduleList, dragging])

	return (
		<div className={cx('calendar_wrap')}>
			<div className={cx('calendar_title')}>
				<strong className={cx('calendar_info')}>{`${year} / ${month}`}</strong>
			</div>
			<div className={cx('calendar_area')}>
				<CalendarHeader />
				<div className={cx('calendar_content')}>
					{/* 달력 그리기 */}
					{calendarScheduleList &&
						dateInfoList?.map((dateInfoRow, i) => (
							<div key={`row-${i}`} className={cx('calendar_row')}>
								{dateInfoRow?.map((dateInfoItem, j) => {
									return (
										<CalendarCell
											key={dateInfoItem.dateTime.getTime()}
											dateTime={dateInfoItem.dateTime}
											isDimmed={dateInfoItem.dateTime.getMonth() !== month - 1}
											isHoliday={dateInfoItem.isHoliday}
											scheduleList={dateInfoItem.scheduleList}
											setDragging={setDragging}
											changeSchedule={() => changeSchedule(dateInfoItem.dateTime)}
										/>
									)
								})}
							</div>
						))}

					{/* 일정 그리기  */}
					{calendarScheduleList?.map((scheduleItem) => {
						return scheduleItem?.renderList?.map((renderItem) => {
							const { top, left, width, stack, opacity, scheduleIndex } = renderItem

							if (stack < 4) {
								return (
									<div className={cx('schedule_item')} style={{ top, left, width, opacity }}>
										<CalendarItem
											{...scheduleItem}
											setDragging={() => setDragging(scheduleIndex)}
											resetDragging={() => setDragging(-1)}
										/>
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
