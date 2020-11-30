import React, { useEffect } from 'react'

import classNames from 'classnames/bind'
import { getCategoryList } from './commonState'
import { createCalendar, deleteCalendar, updateCalendar } from '../../reducers/calendar'

import CalendarItemPopup from './CalendarItemPopup'
import { useCalendarContext } from '../../contexts/calendar'
import { ReactComponent as IconLocation } from '../../assets/images/svg/icon-location.svg'
import { ReactComponent as IconLock } from '../../assets/images/svg/icon-lock.svg'

import styles from './CalendarItemPopupInfo.module.scss'
import useInput from './useInput'
import useToggle from './useToggle'
import { InputCheckbox, InputDate, InputSelector, InputText } from './Input'
import { ReactComponent as IconLockOpen } from '../../assets/images/svg/icon-lock-open.svg'
import { parseDateToString, parseDateToTimeString } from '../../utils/calendar'

const cx = classNames.bind(styles)

const CalendarItemPopupInfo = ({ id, handleClose, isNew = false, ...item }) => {
	const { calendarDispatch } = useCalendarContext()

	const {
		calendarId = Math.random(),
		title = '',
		startAt = new Date(),
		endAt = new Date(),
		location = '',
		category = 'A',
		isAllDay = false,
		isBlocked = false,
		// isRepeatable = false,
	} = item

	const isNewItem = !!!item.calendarId

	const handleInputDate = (e) => {
		const { type, value } = e.target

		if (type === 'time') {
			const [hours, minutes] = value.split(':')
			const formattedDate = new Date(startAtState)

			formattedDate.setHours(hours)
			formattedDate.setMinutes(minutes)

			return formattedDate
		}

		return new Date(value)
	}

	const [titleState, handleTitleChange] = useInput({ initialValue: title })
	const [startAtState, handleStartDateAtChange] = useInput({ initialValue: startAt, handleChange: handleInputDate })
	const [endAtState, handleEndDateAtChange] = useInput({ initialValue: endAt, handleChange: handleInputDate })
	const [locationState, handleLocationChange] = useInput({ initialValue: location })
	const [categoryState] = useInput({ initialValue: category })
	const [isAllDayState, handleIsAllDayChange] = useToggle({ initialValue: isAllDay })
	const [isBlockedState, handleIsBlockedChange] = useToggle({ initialValue: isBlocked })

	const getActionCreator = isNewItem ? createCalendar : updateCalendar

	const createNewCalendarItem = () => {
		const action = getActionCreator({
			calendarId,
			title: titleState,
			startAt: startAtState,
			endAt: endAtState,
			location: locationState,
			category: categoryState,
			isAllDay: isAllDayState,
			isBlocked: isBlockedState,
		})

		calendarDispatch(action)
	}

	const onDelete = () => {
		calendarDispatch(deleteCalendar(item))

		handleClose()
	}

	useEffect(() => {
		if (isNew) {
			createNewCalendarItem()
		}
	}, [])

	return (
		<CalendarItemPopup id={id} handleClose={handleClose}>
			<div className={cx('component')}>
				<div className={cx('area-flex')}>
					<div className={cx('item', 'type-none')}>
						<InputSelector
							id="category"
							value={categoryState}
							list={getCategoryList()}
							handler={() => {}}
						/>
					</div>
					<div className={cx('item')}>
						<InputText id="title" placeholder="할 일" value={titleState} handler={handleTitleChange} />
					</div>
					<div className={cx('item', 'type-none')}>
						<button type="button" className={cx('button', 'lock')} onClick={handleIsBlockedChange}>
							{isBlockedState ? (
								<>
									<span className="blind">잠금해제</span>
									<IconLock width={15} height={15} />
								</>
							) : (
								<>
									<span className="blind">잠금</span>
									<IconLockOpen width={15} height={15} />
								</>
							)}
						</button>
					</div>
				</div>
				{isAllDay ? (
					<div className={cx('area-flex')}>
						<div className={cx('item')}>
							<InputDate
								id="date-start"
								value={parseDateToString(startAtState)}
								handler={handleStartDateAtChange}
							/>
						</div>
						<div className={cx('item', 'type-none')}>
							<span className={cx('delimiter')}>~</span>
						</div>
						<div className={cx('item')}>
							<InputDate
								id="date-end"
								value={parseDateToString(endAtState)}
								handler={handleEndDateAtChange}
							/>
						</div>
					</div>
				) : (
					<div className={cx('area-flex')}>
						<div className={cx('item')}>
							<InputDate
								id="time-start"
								value={parseDateToTimeString(startAtState)}
								handler={handleStartDateAtChange}
								typeTime
							/>
						</div>
						<div className={cx('item')}>
							<span className={cx('delimiter')}>~</span>
						</div>
						<div className={cx('item')}>
							<InputDate
								id="time-end"
								value={parseDateToTimeString(endAtState)}
								handler={handleEndDateAtChange}
								typeTime
							/>
						</div>
					</div>
				)}

				<InputCheckbox id="all-day" label="하루 종일" value={isAllDayState} handler={handleIsAllDayChange} />
				{location && (
					<>
						<dt className={cx('icon')}>
							<IconLocation width={10} height={10} />
						</dt>
						<InputText
							id="location"
							placeholder="위치 정보"
							value={locationState}
							handler={handleLocationChange}
						/>
					</>
				)}
				<div className={cx('area-button')}>
					<div className={cx('cell')}>
						<button type="button" className={cx('button')} onClick={onDelete}>
							Delete
						</button>
					</div>
				</div>
			</div>
		</CalendarItemPopup>
	)
}

export default CalendarItemPopupInfo
