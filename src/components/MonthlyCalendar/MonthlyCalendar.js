import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'

import { useCalendarContext } from '../../contexts/calendar'
import { getMonthInfo, getDateInfo, calcWeekCount, isSameDate, calcScheduleDay } from '../../utils/calendar'

import CalendarItem from '../CalendarItem'
import CalendarItemPopupEditor from '../CalendarItem/CalendarItemPopupEditor'

import styles from './MonthlyCalendar.module.scss'
import DragDate from '../Drag/DragDate'
import { dragType } from '../../const/dragType'
import DragSchedule from '../Drag/DragSchedule'
const moment = require('moment')
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
const CalendarCell = ({ dateTime, isHoliday, isDimmed, scheduleList, changeSchedule, getDragType, setDragDateStart, setDragDateEnter, resetDragDate, setDragDateDrop }) => {
	const [moreList, setMoreList] = useState()
	const { calendarStore } = useCalendarContext()
	const [isEditorShown, setIsEditorShown] = useState(false)

	// TODO: 날짜 형식 YYYY-MM-DD, YYYY-MM-DD-HH:SS 처럼 통일화 필요 (moment.js 활용가능)
	const { year, month, date } = getDateInfo(dateTime)
	const dateInfo = moment(dateTime).format('YYYY-MM-DD')
	const calendarList = calendarStore[dateInfo]
	const type = getDragType()
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

	const filterOverStackSchedule = () => scheduleList.filter((scheduleItem) => scheduleItem.stack > 3)

	useEffect(() => {
		setMoreList(filterOverStackSchedule())
	}, [scheduleList])

	const scheduleEnterStyle = {
		backgroundColor: 'grey'
	}

	return (
		<div className={cx('calendar_cell')} onClick={onCellClick}>
			<DragDate setDragDateStart={setDragDateStart} setDragDateEnter={setDragDateEnter} resetDragDate={resetDragDate} setDragDateDrop={setDragDateDrop} setDragScheduleDrop={changeSchedule} scheduleEnterStyle={scheduleEnterStyle} type={type}>
				<div className={cx('cell_header')}>
					<span className={cx('date', { '-holiday': isHoliday, is_dimmed: isDimmed })}>{date}</span>
					{moreList && moreList.length > 0 && (
						<button className={cx('more_button')} type={'button'} onClick={onMoreButtonClick}>
							{moreList.length} more
						</button>
					)}
					{calendarList && calendarList.map((item) => <CalendarItem key={item.calendarId} {...item} />)}
					{isEditorShown && <CalendarItemPopupEditor handleClose={handleEditorClose} dateInfo={dateInfo} />}
				</div>
			</DragDate>
		</div>
	)
}

// 월 달력
const MonthlyCalendar = ({ year = getDateInfo().year, month = getDateInfo().month }) => {
	const [scheduleList, setScheduleList] = useState([])
	const [dragSchedule, setDragSchedule] = useState(-1)
	const [dragDate, setDragDate] = useState({ firstDate: undefined, secondDate: undefined })
	const [newScheduleRenderList, setNewScheduleRenderList] = useState()
	const [calendarScheduleList, setCalendarScheduleList] = useState()
	const [dateInfoList, setDateInfoList] = useState()
	const { calendarStore } = useCalendarContext()

	useEffect(() => {
		setScheduleList(calendarStore.scheduleList)
	}, [calendarStore.scheduleList])



	const currentMonthInfo = getMonthInfo({ year, month })
	const weekCount = calcWeekCount({ year, month })

	const changeSchedule = (startAt) => {
		if (dragSchedule < 0) return;
		const diffDays = dateDiffInDays(scheduleList[dragSchedule].startAt, scheduleList[dragSchedule].endAt);
		const endAt = new Date(startAt)
		endAt.setDate(startAt.getDate() + diffDays)
		scheduleList[dragSchedule] = { ...scheduleList[dragSchedule], startAt: startAt, endAt: endAt }
		setScheduleList([...scheduleList.slice(0, dragSchedule), { ...scheduleList[dragSchedule] }, ...scheduleList.slice(dragSchedule + 1)])
	}

	const getDragType = () => {
		if (dragSchedule >= 0) {
			return dragType.SCHEDULE
		}
		else if (dragDate.firstDate || dragDate.secondDate) {
			return dragType.DATE
		}
		else {
			return undefined
		}
	}
	// 현재 선택된 '달' 달력 정보 만들기
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

		return newDateInfoList
	}

	const makeNewSchedule = (newDateInfoList) => {

		let newScheduleStart = undefined
		let newScheduleEnd = undefined
		let tempScheduleRenderList = []
		if (dragDate.firstDate && dragDate.secondDate) {
			if (dragDate.firstDate < dragDate.secondDate) {
				newScheduleStart = dragDate.firstDate
				newScheduleEnd = dragDate.secondDate
			}
			else {
				newScheduleStart = dragDate.secondDate
				newScheduleEnd = dragDate.firstDate
			}
		}

		for (let week = 0; week < weekCount; week++) {
			for (let day = 0; day < 7; day++) {

				if (isSameDate(newDateInfoList[week][day].dateTime, newScheduleStart)) {
					const time = newScheduleEnd - newScheduleStart
					let period = Math.floor(time / 86400000 + 1)
					while (period > 0) {
						const top = `${(100 / weekCount) * week}%`
						const left = `${14.29 * day}%`
						let width;
						if (7 - day < period) {
							width = `${14.29 * (7 - day)}%`
							period = period - (7 - day)
						} else {
							width = `${period * 14.29}%`
							period = 0
						}
						const height = `${600 / weekCount}px`
						tempScheduleRenderList.push({ top, left, width, height })
						week++
						day = 0
					}
				}
			}
		}
		setNewScheduleRenderList(tempScheduleRenderList)
	}


	// 현재 선택된 '달'의 달력에 맞는 scheduleList 를 만드는 함수
	const getNewScheduleList = (scheduleList, dateInfoList) =>
		ascendingScheduleList(scheduleList).map((scheduleItem, scheduleIndex) => {
			let period = calcScheduleDay(scheduleItem)
			let renderList = []

			for (let i = 0; i < weekCount; i++) {
				for (let j = 0; j < 7; j++) {
					let day = j;
					let week = i;
					
					if (isSameDate(dateInfoList[i][j].dateTime, scheduleItem.startAt)) {
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
											{ top, left, width, stack, scheduleIndex },
											scheduleIndex === DragSchedule && { opacity: 0.5 },
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
											{ top, left, width, stack, scheduleIndex },
											scheduleIndex === dragSchedule && { opacity: 0.5 },
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

						return {
							...scheduleItem,
							renderList,
						}
					}


				}
			}

		})


	// 먼저 시작하는 일정 순서로 정렬
	const ascendingScheduleList = (scheduleList) =>
		scheduleList.sort((a, b) => a.startAt.getTime() - b.startAt.getTime())

	useEffect(() => {
		const newDateInfoList = makeDateInfoList() // 달력정보 만들기
		const newScheduleList = getNewScheduleList(scheduleList, newDateInfoList) // scheduleList 만들기
		makeNewSchedule(newDateInfoList)
		setDateInfoList(newDateInfoList)
		setCalendarScheduleList(newScheduleList)
	}, [scheduleList, dragSchedule, dragDate])

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
										scheduleList={dateInfoItem.scheduleList}
										changeSchedule={() => changeSchedule(dateInfoItem.dateTime)}
										getDragType={() => getDragType()}
										setDragDateStart={() => setDragDate({ ...dragDate, firstDate: dateInfoItem.dateTime })}
										setDragDateEnter={() => setDragDate({ ...dragDate, secondDate: dateInfoItem.dateTime })}
										resetDragDate={() => setDragDate({ firstDate: undefined, secondDate: undefined })}
										setDragDateDrop={() => console.log(dragDate)}
									/>
								)
							})}
						</div>
					))}

					{/* 일정 그리기  */}
					{calendarScheduleList?.map((scheduleItem) => {
						return scheduleItem?.renderList?.map((renderItem) => {
							const { top, left, width, stack, opacity, scheduleIndex } = renderItem

							const startAt = getDateInfo(scheduleItem.startAt)
							const endAt = getDateInfo(scheduleItem.endAt)
							const startAtString = `${startAt.year}/${startAt.month}/${startAt.date}`
							const endAtString = `${endAt.year}/${endAt.month}/${endAt.date}`

							if (stack < 4) {
								return (
									<div className={cx('schedule_item')} style={{ top, left, width, opacity }}>
										<CalendarItem {...scheduleItem} startAt={startAtString} endAt={endAtString}
											setDragSchedule={() => setDragSchedule(scheduleIndex)}
											resetDragSchedule={() => setDragSchedule(-1)} />
									</div>
								)
							}
						})
					})}
					{newScheduleRenderList?.map(renderItem => {
						const { top, left, width, height } = renderItem
						return <div style={{ top, left, width, height, backgroundColor: 'rgba(255,0,0,0.1)', position: 'absolute', zIndex: '-1' }} />
					})}
				</div>
			</div>
		</div>
	)
}


export default MonthlyCalendar
