import React, { useEffect, useState } from 'react'
import classNames from 'classnames/bind'

import { CATEGORY_NAME } from '../../constants/defaultCategory'
import { createCalendar, deleteCalendar, updateCalendar } from '../../reducers/calendar'
import { useCalendarContext } from '../../contexts/calendar'

import Schedule from '../../utils/Schedule'
import CalendarItemPopupPortal from './CalendarItemPopupPortal'
import { InputCategory, InputTitle, InputIsBlocked, InputDate, InputIsAllDay } from '../Input/Input'

import styles from './CalendarItemPopupInfo.module.scss'

const cx = classNames.bind(styles)

const CalendarItemPopupInfo = ({ id, handleClose, isNew = false, schedule }) => {
	const { calendarDispatch } = useCalendarContext()
	const [_schedule, setSchedule] = useState(null)

	const [scheduleIdState, setScheduleIdState] = useState(null)

	const createNewCalendarItem = (newCalendar) => {
		const action = createCalendar(newCalendar)

		calendarDispatch(action)
	}

	useEffect(() => {
		if (isNew) {
			const newCalendarItem = new Schedule({
				startAt: schedule.startAt,
				endAt: schedule.endAt,
			})

			setSchedule(newCalendarItem)
			setScheduleIdState(newCalendarItem.scheduleId)

			createNewCalendarItem(newCalendarItem)
		} else {
			setSchedule(schedule)
			setScheduleIdState(schedule.scheduleId)
		}
	}, [])

	const onDelete = (e) => {
		calendarDispatch(deleteCalendar(scheduleIdState))

		handleClose(e)
	}

	const handleValueChange = ({ property, value }) => {
		const action = updateCalendar({
			scheduleId: scheduleIdState,
			[property]: value,
		})

		const updatedSchedule = new Schedule({
			..._schedule,
			[property]: value,
		})

		calendarDispatch(action)

		setSchedule(updatedSchedule)
	}

	const onDone = (e) => {
		handleClose(e)
	}

	return (
		<CalendarItemPopupPortal id={id} handleClose={handleClose}>
			{_schedule && (
				<div className={cx('component')}>
					<div className={cx('area-flex')}>
						<div className={cx('item', 'type-none')}>
							<InputCategory
								category={_schedule.category}
								readOnly={_schedule.isBlocked}
								onChange={handleValueChange}
							/>
						</div>
						<div className={cx('item')}>
							<InputTitle
								title={_schedule.title}
								readOnly={_schedule.isBlocked}
								onChange={handleValueChange}
							/>
						</div>

						<div className={cx('item', 'type-none')}>
							<InputIsBlocked isBlocked={_schedule.isBlocked} onChange={handleValueChange} />
						</div>
					</div>
					<div className={cx('area-flex')}>
						{_schedule.isAllDay ? (
							<>
								<div className={cx('item', 'type-date')}>
									<InputDate
										property="startAt"
										date={_schedule.startAt}
										readOnly={_schedule.isBlocked}
										onChange={handleValueChange}
									/>
								</div>
								<div className={cx('item', 'type-date')}>
									<InputDate
										property="endAt"
										date={_schedule.endAt}
										readOnly={_schedule.isBlocked}
										onChange={handleValueChange}
									/>
								</div>
							</>
						) : (
							<>
								<div className={cx('item', 'type-date')}>
									<InputDate
										property="startAt"
										date={_schedule.startAt}
										readOnly={_schedule.isBlocked}
										onChange={handleValueChange}
										typeTime
									/>
								</div>
								<div className={cx('item', 'type-date')}>
									<InputDate
										property="endAt"
										date={_schedule.endAt}
										readOnly={_schedule.isBlocked}
										onChange={handleValueChange}
										typeTime
									/>
								</div>
							</>
						)}
					</div>
					<div className={cx('area-flex')}>
						<div className={cx('item')}>
							<InputIsAllDay
								isAllDay={_schedule.isAllDay}
								readOnly={_schedule.isBlocked}
								onChange={handleValueChange}
							/>
						</div>
					</div>
					<div className={cx('area-button')}>
						<div className={cx('cell')}>
							<button type="button" className={cx('button')} onClick={onDelete}>
								Delete
							</button>
						</div>
						<div className={cx('cell')}>
							<button type="button" className={cx('button')} onClick={onDone}>
								Done
							</button>
						</div>
					</div>
				</div>
			)}
		</CalendarItemPopupPortal>
	)
}

export default CalendarItemPopupInfo
