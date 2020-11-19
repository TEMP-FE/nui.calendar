import React, { useState, useEffect } from 'react'
import styles from './WeeklyCalendar.module.scss'
import classNames from 'classnames/bind'

import CalendarItem from '../CalendarItem/CalendarItem'
import ButtonArea from '../ButtonArea/ButtonArea'
import DragDate from '../Drag/DragDate'
import { dragType } from '../../const/dragType'

const cx = classNames.bind(styles)
const moment = require('moment')

const curDay = new Date()
const year = curDay.getFullYear()
const month = curDay.getMonth()
const date = curDay.getDate()
const dayOfWeek = curDay.getDay()

const WeeklyCalendar = () => {
	const [week, setWeek] = useState([])
	const dayOfWeekList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const timeLine = new Array(24)
	const [dragSchedule, setDragSchedule] = useState(-1)
	const [dragDate, setDragDate] = useState({ firstDate: undefined, secondDate: undefined })
	const [newScheduleRenderList, setNewScheduleRenderList] = useState()
	const [currentDragType, setCurrentDragType] = useState(undefined)
	for (var i = 0; i < timeLine.length; i++) {
		timeLine[i] = i
	}

	const getDragType = () => {
		if (dragSchedule >= 0) {
			return dragType.SCHEDULE
		}
		else if (dragDate.firstDate) {
			return dragType.DATE
		}
		else {
			return undefined
		}
	}

	const getThisWeek = () => {
		const thisWeek = []

		for (var i = 0; i < 7; i++) {
			thisWeek.push(new Date(year, month, date + (i - dayOfWeek)))
		}

		setWeek(thisWeek)
	}

	const changeWeek = (state) => {
		const tempWeek = []

		for (let i = 0; i < 7; i++) {
			var temp = new Date(week[i])
			temp.setDate(temp.getDate() + (state ? 7 : -7))
			tempWeek.push(temp)
		}
		setWeek(tempWeek)
	}

	const log = (info) => {
		console.log(info.getFullYear(), info.getMonth() + 1, info.getDate())
	}

	const timelog = (time, value) => {
		console.log(value === '0' ? time + ':00 ~ ' + time + ':30' : time + ':30 ~ ' + (time + 1) + ':00')
	}

	useEffect(() => {
		getThisWeek()
	}, [])

	useEffect(() => {
		setCurrentDragType(getDragType());
		if (dragDate.firstDate && dragDate.secondDate) {
			separateDraggedDate()
		}
		else if (!dragDate.firstDate && !dragDate.secondDate) {
			setNewScheduleRenderList([])
		}
	}, [dragDate, dragSchedule])

	const calendarItemList = [
		{
			title: '테스트',
			startAt: '2020-11-02 12:30',
			endAt: '2020-11-02 16:30',
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '테스트',
			startAt: '2020-11-05 06:20',
			endAt: '2020-11-05 09:57',
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '테스트',
			startAt: '2020-11-05 11:20',
			endAt: '2020-11-05 13:57',
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '테스트',
			startAt: '2020-11-11 06:40',
			endAt: '2020-11-11 11:20',
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
	]

	const calcStartPoint = (startDate) => {
		return Math.round((new Date(startDate).getHours() * 60 + new Date(startDate).getMinutes()) * (26 / 30))
	}

	const calcCalendarItemHeight = (startDate, endDate) => {
		return Math.round(((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60)) * (26 / 30))
	}

	const testItem1 = {
		title: '테스트',
		startAt: '2020-11-03 12:30',
		endAt: '2020-11-04 03:31',
		location: '',
		category: '',
		isAllDay: true,
		isBlocked: false,
		isPrivate: false,
		isRepeatable: false,
	}
	const testItem2 = {
		title: '테스트',
		startAt: '2020-11-03 12:30',
		endAt: '2020-11-04 16:40',
		location: '',
		category: '',
		isAllDay: true,
		isBlocked: false,
		isPrivate: false,
		isRepeatable: false,
	}

	const checkItemDateEqual = (Item) => {
		const startAt = new Date(Item.startAt)
		const endAt = new Date(Item.endAt)

		if (endAt.getDate() !== startAt.getDate()) {
			isAllday(startAt, endAt) ? pushAlldayItem(Item) : pushSeparatedItem(Item, startAt, endAt)
		}
	}

	const isAllday = (startAt, endAt) => {
		return endAt.getTime() - startAt.getTime() > 86400000 ? true : false
	}

	const pushAlldayItem = () => {
		console.log('allDay아이템입니다.')
	}

	const pushSeparatedItem = (Item, startAt, endAt) => {
		const endTime = '24:00'
		const startTime = '00:00'

		const startItem = { ...Item, endAt: moment(startAt).format('YYYY-MM-DD') + ' ' + endTime }
		const endItem = { ...Item, startAt: moment(endAt).format('YYYY-MM-DD') + ' ' + startTime }

		calendarItemList.push(startItem, endItem)
	}

	const separateDraggedDate = () => {
		const startAt = dragDate.firstDate.startAt < dragDate.secondDate.startAt ? dragDate.firstDate.startAt : dragDate.secondDate.startAt
		const endAt = dragDate.firstDate.endAt > dragDate.secondDate.endAt ? dragDate.firstDate.endAt : dragDate.secondDate.endAt
		const endTime = '24:00'
		const startTime = '00:00'
		const tempList = []
		const dayDiff = endAt.getDay() - startAt.getDay()
		console.log(dayDiff)
		if (dayDiff > 0) {
			tempList.push({ startAt: startAt, endAt: new Date(moment(startAt).format('YYYY-MM-DD') + ' ' + endTime) })
			for (let i = 1; i < dayDiff; ++i) {
				const tempStart = new Date(moment(startAt).add(i, 'd').format('YYYY-MM-DD') + ' ' + startTime)
				const tempEnd = new Date(moment(startAt).add(i, 'd').format('YYYY-MM-DD') + ' ' + endTime)
				tempList.push({ startAt: tempStart, endAt: tempEnd })
			}
			tempList.push({ startAt: new Date(moment(endAt).format('YYYY-MM-DD') + ' ' + startTime), endAt: endAt })
		}
		else {
			tempList.push({ startAt: startAt, endAt: endAt })
		}
		setNewScheduleRenderList(tempList)
	}

	const getNewDateWithMinutes = (date, hour, minutes) => {
		const startAt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minutes);
		const endAt = new Date(startAt);
		endAt.setMinutes(endAt.getMinutes() + 30)
		return { startAt, endAt }
	}

	checkItemDateEqual(testItem1)

	return (
		<>
			<ButtonArea data={week} getThis={getThisWeek} getChange={changeWeek} />
			<strong className={cx('range')}>
				{moment(week[0]).format('YYYY.MM.DD')} ~{moment(week[6]).format('YYYY.MM.DD')}
			</strong>
			<div className={cx('table')}>
				<div className={cx('header')}>
					{dayOfWeekList.map((dayOfWeek, index) => (
						<div key={index} className={cx('date', new Date(week[index]) < new Date() && 'dimmed')}>
							{new Date(week[index]).getDate()}
							<em>{dayOfWeek}</em>
						</div>
					))}
				</div>
				<div className={cx('view_wrap')}>
					<div className={cx('allday')}>
						<div className={cx('time')}>allday</div>
						<div className={cx('view')}>
							{week.map((info, index) => (
								<div className={cx('allday_cell')} key={index} onClick={() => log(info)}></div>
							))}
						</div>
					</div>
					<div className={cx('schedule')}>
						<div className={cx('time')}>
							{timeLine.map((time) => (
								<div key={time} className={cx('time_cell')}>
									<span className={cx('time_stamp')}>{time}</span>
								</div>
							))}
						</div>
						<div className={cx('view')}>
							{week.map((info, index) => (
								<div className={cx('view_cell')} key={index} onClick={() => log(info)}>
									{timeLine.map((time) => (
										<div className={cx('detail_wrap')} key={time}>
											<DragDate setDragDateStart={() => setDragDate({ ...dragDate, firstDate: getNewDateWithMinutes(info, time, 0) })}
												setDragDateEnter={() => setDragDate({ ...dragDate, secondDate: getNewDateWithMinutes(info, time, 0) })}
												resetDragDate={() => setDragDate({ firstDate: undefined, secondDate: undefined })}
												setDragDateDrop={() => console.log(dragDate)}
												type={currentDragType}
											>
												<div className={cx('detail_cell')} data-value="0"></div>
											</DragDate>
											<DragDate setDragDateStart={() => setDragDate({ ...dragDate, firstDate: getNewDateWithMinutes(info, time, 30) })}
												setDragDateEnter={() => setDragDate({ ...dragDate, secondDate: getNewDateWithMinutes(info, time, 30) })}
												resetDragDate={() => setDragDate({ firstDate: undefined, secondDate: undefined })}
												setDragDateDrop={() => console.log(dragDate)}
												type={currentDragType}>
												<div className={cx('detail_cell')} data-value="30"></div>
											</DragDate>
										</div>
									))}
									{calendarItemList.map(
										(calendarItem) =>
											info.getDate() === new Date(calendarItem.startAt).getDate() && (
												<CalendarItem
													{...calendarItem}
													style={{
														top: calcStartPoint(calendarItem.startAt),
														left: '0',
														right: '5px',
														height: calcCalendarItemHeight(
															calendarItem.startAt,
															calendarItem.endAt,
														),
													}}
												/>
											),
									)}
									{newScheduleRenderList?.map(
										(item) => item.startAt.getDate() === info.getDate() &&
											<div style={{
												position: "absolute",
												top: calcStartPoint(item.startAt),
												left: '0',
												right: '5px',
												height: calcCalendarItemHeight(
													item.startAt,
													item.endAt,
												),
												backgroundColor: 'orange',
												zIndex: '-5'
											}}
											/>
									)}
								</div>
							))}
						</div>
						<div></div>
					</div>
				</div>
			</div>
		</>
	)
}

export default WeeklyCalendar
