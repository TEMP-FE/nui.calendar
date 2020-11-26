import React, { useState, useEffect } from 'react'
import styles from './WeeklyCalendar.module.scss'
import classNames from 'classnames/bind'

import CalendarItem from '../CalendarItem/CalendarItem'
import ButtonArea from '../ButtonArea/ButtonArea'
import DragDate from '../Drag/DragDate'
import { calendarType } from '../../const/drag'
import { useCalendarContext, useDragDateContext, useDragScheduleContext } from '../../contexts/calendar'
import { setCalendar } from '../../reducers/dragDate'
import { resetScheduleDrag } from '../../reducers/dragSchedule'
import { updateCalendar } from '../../reducers/calendar'

const cx = classNames.bind(styles)
const moment = require('moment')

const curDay = new Date()
const year = curDay.getFullYear()
const month = curDay.getMonth()
const date = curDay.getDate()
const dayOfWeek = curDay.getDay()

const WeeklyCalendar = () => {
	const { dragDateDispatch, dragDateStore } = useDragDateContext()
	const { dragScheduleDispatch, dragScheduleStore } = useDragScheduleContext()
	const { calendarStore, calendarDispatch } = useCalendarContext()
	const [calendarItemList, setCalendarItemList] = useState([])

	const [week, setWeek] = useState([])
	const dayOfWeekList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const timeLine = new Array(24)
	const [draggingRenderList, setDraggingRenderList] = useState()

	for (var i = 0; i < timeLine.length; i++) {
		timeLine[i] = i
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
		dragDateDispatch(setCalendar(calendarType.WEEK))
		dragScheduleDispatch(setCalendar(calendarType.WEEK))
	}, [])

	useEffect(() => {
		setDraggingRenderList(dragDateStore.renderList)
	}, [dragDateStore.renderList])

	useEffect(() => {
		if (dragScheduleStore.isResizing) {
			let resizingSchedule = calendarStore.scheduleList[dragScheduleStore.dragInfo.index]
			resizingSchedule = {
				...resizingSchedule,
				endAt: dragScheduleStore.dragInfo.endAt.toDate()
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
				endAt: dragScheduleStore.dragInfo.endAt.toDate()
			}
			calendarDispatch(updateCalendar(movedSchedule))
			dragScheduleDispatch(resetScheduleDrag())
		}
	}, [dragScheduleStore.isDropped])

	const calcStartPoint = (startDate) => {
		return Math.round((new Date(startDate).getHours() * 60 + new Date(startDate).getMinutes()) * (26 / 30))
	}

	const calcCalendarItemHeight = (startDate, endDate) => {
		return Math.round(((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60)) * (26 / 30))
	}

	const checkItemDateEqual = (item) => {
		const { startAt, endAt } = item

		if (endAt.getDate() === startAt.getDate()) {
			return item
		}

		return isAllday(startAt, endAt) ? pushAlldayItem(item) : pushSeparatedItem(item, startAt, endAt)
	}

	useEffect(() => {
		const filteredList = calendarStore.scheduleList.map((item, index) => {
			const itemWithIndex = { ...item, index: index, scheduleStartAt: item.startAt, scheduleEndAt: item.endAt }
			const filteredItem = checkItemDateEqual(itemWithIndex)

			return filteredItem
		})

		setCalendarItemList(filteredList.flat())
	}, [calendarStore.scheduleList])

	const isAllday = (startAt, endAt) => {
		return endAt.getTime() - startAt.getTime() > 86400000 ? true : false
	}

	const pushAlldayItem = (item) => {
		console.log('allDay아이템입니다.')

		return item
	}

	const pushSeparatedItem = (Item, startAt, endAt) => {
		const endTime = '24:00'
		const startTime = '00:00'

		const startItem = { ...Item, endAt: moment(startAt).format('YYYY-MM-DD') + ' ' + endTime }
		const endItem = { ...Item, startAt: moment(endAt).format('YYYY-MM-DD') + ' ' + startTime }

		return [startItem, endItem]
	}

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
											<DragDate className={cx('detail_cell')} date={moment(info).hour(time)} />
											<DragDate className={cx('detail_cell')} date={moment(info).hour(time).minute(30)} />
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
									{draggingRenderList?.map(
										(item) =>
											item.startAt.toDate().getDate() === info.getDate() && (
												<div
													style={{
														position: 'absolute',
														top: calcStartPoint(item.startAt.toDate()),
														left: '0',
														right: '5px',
														height: calcCalendarItemHeight(item.startAt.toDate(), item.endAt.toDate()),
														backgroundColor: 'rgba(255,0,0,0.1)',
														zIndex: '-5',
													}}
												/>
											),
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
