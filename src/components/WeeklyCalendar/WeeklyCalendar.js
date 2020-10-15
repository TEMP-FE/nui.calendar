import React, { useState, useEffect } from 'react'
import styles from './WeeklyCalendar.module.scss'
import classNames from 'classnames/bind'

import { ReactComponent as IconPrev } from '../../assets/images/svg/arrow_prev.svg'
import { ReactComponent as IconNext } from '../../assets/images/svg/arrow_next.svg'
import CalendarItem from '../CalendarItem/CalendarItem'

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

	const getPrevWeek = () => {
		const prevWeek = []
		for (let i = 0; i < 7; i++) {
			var temp = new Date(week[i])
			temp.setDate(temp.getDate() - 7)
			prevWeek.push(temp)
		}
		setWeek(prevWeek)
	}

	const getNextWeek = () => {
		const nextWeek = []
		for (let i = 0; i < 7; i++) {
			var temp = new Date(week[i])
			temp.setDate(temp.getDate() + 7)
			nextWeek.push(temp)
		}
		setWeek(nextWeek)
	}

	const log = (info) => {
		console.log(info.getFullYear(), info.getMonth() + 1, info.getDate())
	}

	const timelog = (time, value) => {
		console.log(value === 0 ? time + ':00 ~ ' + time + ':30' : time + ':30 ~ ' + (time + 1) + ':00')
	}

	useEffect(() => {
		getThisWeek()
	}, [])

	const calendarItemA = {
		title: '테스트',
		startAt: '0606',
		endAt: '0606',
		location: '',
		category: '',
		isAllDay: false,
		isBlocked: false,
		isPrivate: false,
		isRepeatable: false,
	}
	const calendarItemB = {
		title: '테스트',
		startAt: '0606',
		endAt: '0606',
		location: '',
		category: '',
		isAllDay: true,
		isBlocked: false,
		isPrivate: false,
		isRepeatable: false,
	}

	return (
		<>
			<div className={cx('menu')}>
				<button type="button" className={cx('btn', 'today')} onClick={() => getThisWeek()}>
					Today
				</button>
				<button type="button" className={cx('btn', 'prev')} onClick={() => getPrevWeek()}>
					<IconPrev width="14" height="14" />
				</button>
				<button type="button" className={cx('btn', 'next')} onClick={() => getNextWeek()}>
					<IconNext width="14" height="14" />
				</button>
			</div>
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
											<div className={cx('detail_cell')} onClick={() => timelog(time, 0)}>
												{/*<CalendarItem {...calendarItemA} />*/}
											</div>
											<div className={cx('detail_cell')} onClick={() => timelog(time, 30)}>
												{/*<CalendarItem {...calendarItemB} />*/}
											</div>
										</div>
									))}
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
