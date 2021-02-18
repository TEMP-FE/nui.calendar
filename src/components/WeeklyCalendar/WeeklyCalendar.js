import React, { useState, useEffect } from 'react'
import styles from './WeeklyCalendar.module.scss'
import classNames from 'classnames/bind'
import moment from 'moment'

import ButtonArea from '../ButtonArea/ButtonArea'
import DragDate from '../Drag/DragDate'
import { calendarType } from '../../const/drag'
import { useCalendarContext } from '../../contexts/calendar'
import { setCalendar } from '../../reducers/dragDate'
import { resetScheduleDrag } from '../../reducers/dragSchedule'
import { updateCalendar } from '../../reducers/calendar'
import CalendarItemWithPopup from '../CalendarItem/CalendarItemWithPopup'
import CalendarItemPopupInfo from '../CalendarItem/CalendarItemPopupInfo'
import { useDragDateContext, useDragScheduleContext } from '../../contexts/drag'

const cx = classNames.bind(styles)

const WeeklyCell = ({ info, time }) => {
	const date = moment(info).date()
	const startAt = moment(info).hour(time).minute(0).second(0)
	const endAt = startAt.clone().minute(30)
	const [popupInfo, setPopupInfo] = useState({ startAt: startAt, endAt: endAt, isPopupShown: false })
	const openPopup = (start = startAt, end = endAt) => setPopupInfo({ startAt: start, endAt: end, isPopupShown: true })
	const closePopup = () => setPopupInfo({ ...popupInfo, isPopupShown: false })

	return (
		<div id={`time-${date}-${time}`} className={cx('detail_wrap')}>
			<DragDate className={cx('detail_cell')} date={startAt} openPopup={openPopup} />
			<DragDate className={cx('detail_cell')} date={endAt} openPopup={openPopup} />
			{popupInfo.isPopupShown && (
				<CalendarItemPopupInfo
					id={`time-${date}-${time}`}
					handleClose={closePopup}
					schedule={{
						startAt: popupInfo.startAt,
						endAt: popupInfo.endAt,
					}}
					isNew
				/>
			)}
		</div>
	)
}

const WeeklyCalendar = () => {
	const { dragDateDispatch, dragDateStore } = useDragDateContext()
	const { dragScheduleDispatch, dragScheduleStore } = useDragScheduleContext()
	const { calendarStore, calendarDispatch } = useCalendarContext()
	const [calendarItemList, setCalendarItemList] = useState([])

	const [week, setWeek] = useState([])
	const timeLine = new Array(24)
	const [draggingRenderList, setDraggingRenderList] = useState()
	const [movingSchedule, setMovingSchedule] = useState([])

	for (var i = 0; i < timeLine.length; i++) {
		timeLine[i] = i
	}

	const getThisWeek = () => {
		const thisWeek = []

		for (var i = 0; i < 7; i++) {
			thisWeek.push(moment().day(i))
		}

		setWeek(thisWeek)
	}

	const changeWeek = (state) => {
		const tempWeek = []
		const calcDay = state ? 7 : -7

		week.map((day) => tempWeek.push(day.add(calcDay, 'day')))

		setWeek(tempWeek)
	}

	const log = (info) => {
		console.log(info)
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
				endAt: dragScheduleStore.dragInfo.endAt,
			}
			calendarDispatch(updateCalendar(resizingSchedule))
		} else if (dragScheduleStore.isDragging) {
			let start = dragScheduleStore.dragInfo.startAt.clone()
			let end = dragScheduleStore.dragInfo.endAt.clone()
			let movingRenderList = []
			while (start.date() !== end.date()) {
				const tempEnd = start.clone().add(1, 'd').set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
				movingRenderList.push({ startAt: start, endAt: tempEnd })
				start = tempEnd
			}
			movingRenderList.push({ startAt: start, endAt: end })
			setMovingSchedule(movingRenderList)
		}
	}, [dragScheduleStore.dragInfo.endAt])

	useEffect(() => {
		if (dragScheduleStore.isDropped) {
			let movedSchedule = calendarStore.scheduleList[dragScheduleStore.dragInfo.index]
			movedSchedule = {
				...movedSchedule,
				startAt: dragScheduleStore.dragInfo.startAt,
				endAt: dragScheduleStore.dragInfo.endAt,
			}
			calendarDispatch(updateCalendar(movedSchedule))
			dragScheduleDispatch(resetScheduleDrag())
			setMovingSchedule([])
		}
	}, [dragScheduleStore.isDropped])

	const calcStartPoint = (startDate) => {
		return Math.round((moment(startDate).format('H') * 60 + parseInt(moment(startDate).format('m'))) * (26 / 30))
	}

	const calcCalendarItemHeight = (startDate, endDate) => {
		return Math.round(((moment(endDate).valueOf() - moment(startDate).valueOf()) / (1000 * 60)) * (26 / 30))
	}

	const checkItemDateEqual = (item) => {
		const { startAt, endAt } = item

		if (moment(endAt).format('D') === moment(startAt).format('D')) {
			return { ...item, isLast: true }
		}

		const renderStart = moment(item.renderStartAt)
		const renderEnd = moment(item.renderEndAt)
		if (renderEnd.hour() + renderEnd.minute() === 0 && renderEnd.subtract(1, 'day').day() === renderStart.day()) {
			return { ...item, renderEndAt: renderStart.clone().set({ hour: 24, minute: 0 }), isLast: true }
		}
		return item.isAllDay ? item : pushSeparatedItem(item, startAt, endAt)
	}

	useEffect(() => {
		const filteredList = calendarStore.scheduleList.map((item, index) => {
			const itemWithIndex = {
				...item,
				index: index,
				startAt: item.startAt,
				endAt: item.endAt,
				renderStartAt: moment(item.startAt),
				renderEndAt: moment(item.endAt),
			}
			const filteredItem = checkItemDateEqual(itemWithIndex)

			return filteredItem
		})

		setCalendarItemList(filteredList.flat())
	}, [calendarStore.scheduleList])

	const pushSeparatedItem = (Item, startAt, endAt) => {
		const endTime = '24:00'
		const startTime = '00:00'

		const startItem = { ...Item, renderEndAt: moment(startAt).format('YYYY-MM-DD') + ' ' + endTime }
		const endItem = { ...Item, renderStartAt: moment(endAt).format('YYYY-MM-DD') + ' ' + startTime, isLast: true }

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
					{week.map((day, index) => (
						<div key={index} className={cx('date', day.isBefore(moment().subtract(1, 'day')) && 'dimmed')}>
							{day.format('D')}
							<em>{day.format('ddd')}</em>
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
								<div className={cx('view_cell')} key={index}>
									{timeLine.map((time, timeIndex) => (
										<WeeklyCell key={`time-${timeIndex}`} info={info} time={time} />
									))}
									{calendarItemList.map((calendarItem, itemKey) => {
										const currentDate = info.format('D')
										const itemDate = moment(calendarItem.renderStartAt).format('D')
										const itemHour = moment(calendarItem.renderStartAt).format('H')
										const hasItem = currentDate === itemDate

										return (
											hasItem && (
												<CalendarItemWithPopup
													key={itemKey}
													id={`time-${itemDate}-${itemHour}`}
													style={{
														top: calcStartPoint(calendarItem.renderStartAt),
														left: '0',
														right: '5px',
														height: calcCalendarItemHeight(
															calendarItem.renderStartAt,
															calendarItem.renderEndAt,
														),
													}}
													schedule={calendarItem}
												/>
											)
										)
									})}
									{movingSchedule.map(
										(item) =>
											info.format('D') === moment(item.startAt).format('D') && (
												<div
													style={{
														position: 'absolute',
														top: calcStartPoint(item.startAt),
														left: '0',
														right: '0',
														zIndex: '-5',
														backgroundColor: 'rgba(255,0,0,0.1)',
														height: calcCalendarItemHeight(item.startAt, item.endAt),
													}}
												/>
											),
									)}
									{draggingRenderList?.map(
										(item) =>
											item.startAt.isSame(info, 'day') && (
												<div
													style={{
														position: 'absolute',
														top: calcStartPoint(item.startAt),
														left: '0',
														right: '5px',
														height: calcCalendarItemHeight(item.startAt, item.endAt),
														backgroundColor: 'rgba(255,0,0,0.1)',
														zIndex: '-5',
													}}
												/>
											),
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default WeeklyCalendar
