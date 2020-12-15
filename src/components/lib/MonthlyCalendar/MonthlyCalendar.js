import React, { useState, useEffect } from 'react'
import classNames from 'classnames/bind'

import styles from './MonthlyCalendar.module.scss'
import CalendarItem from '../../CalendarItem/CalendarItem'
import CalendarItemPopupInfo from '../../CalendarItem/CalendarItemPopupInfo'
import { getMonthInfo, getDateInfo, calcWeekCount } from '../../../utils/calendar'
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

	const filterOverStackSchedule = () => scheduleList.filter((scheduleItem) => scheduleItem.stack > 3)

	useEffect(() => {
		setMoreList(filterOverStackSchedule())
	}, [scheduleList])

	return (
		<div className={cx('calendar_cell')} onClick={onCellClick}>
			<div className={cx('cell_header')}>
				<span className={cx('date', { '-holiday': isHoliday, is_dimmed: isDimmed })}>{date}</span>
				{moreList && moreList.length > 0 && (
					<button className={cx('more_button')} type={'button'} onClick={onMoreButtonClick}>
						{moreList.length} more
					</button>
				)}
				{isEditorShown && (
					<CalendarItemPopupInfo handleClose={handleEditorClose} startAt={startAt} endAt={endAt} isNew />
				)}
			</div>
		</div>
	)
}

// 월 달력
const MonthlyCalendar = ({ year = getDateInfo().year, month = getDateInfo().month }) => {
	const [scheduleList, setScheduleList] = useState([])
	const [calendarScheduleList, setCalendarScheduleList] = useState()
	const [dateInfoList, setDateInfoList] = useState()

	let currentMonthInfo = getMonthInfo({ year, month: month + 1 })
	let weekCount = calcWeekCount({ year, month: month + 1 })

	// 현재 선택된 '달' 달력 정보 만들기
	const makeDateInfoList = () => {
		const newDateInfoList = new Array(weekCount).fill(null).map((_) => [])
		for (let i = 0; i < weekCount; i++) {
			for (let j = 0; j < 7; j++) {
				const date = 1 - currentMonthInfo.firstDayOfWeek + j + i * 7
				const dateTime = new Date(year, month, date)

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

	// 먼저 시작하는 일정 순서로 정렬
	const ascendingScheduleList = (scheduleList) =>
		scheduleList.sort((a, b) => a.startAt.getTime() - b.startAt.getTime())

	useEffect(() => {
		const newDateInfoList = makeDateInfoList() // 달력정보 만들기
		// const newScheduleList = getNewScheduleList(scheduleList, newDateInfoList) // scheduleList 만들기
		setDateInfoList(newDateInfoList)
	}, [scheduleList, year, month])

	return (
		<div className={cx('calendar_wrap')}>
			<div className={cx('calendar_title')}>
				<strong className={cx('calendar_info')}>{`${year} / ${month + 1}`}</strong>
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
										key={dateInfoItem.dateTime.getTime()}
										dateTime={dateInfoItem.dateTime}
										isDimmed={dateInfoItem.dateTime.getMonth() !== month}
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
				</div>
			</div>
		</div>
	)
}

export default MonthlyCalendar
