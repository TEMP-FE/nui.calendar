import React, { useEffect } from 'react'
import { ReactComponent as IconLock } from '../../assets/images/svg/icon-lock.svg'
import { ReactComponent as IconLockOpen } from '../../assets/images/svg/icon-lock-open.svg'
import { ReactComponent as IconClose } from '../../assets/images/svg/icon-close.svg'
import CalendarItemPopup from './CalendarItemPopup'
import { InputCheckbox, InputDate, InputText, InputSelector } from './Input'

import moment from 'moment'
import classNames from 'classnames/bind'
import { useCalendarContext } from '../../contexts/calendar'
import { createCalendar, updateCalendar } from '../../reducers/calendar'
import useInput from './useInput'
import useToggle from './useToggle'

import styles from './CalendarItemPopupEditor.module.scss'
import { parseDateToString, parseDateToTimeString } from '../../utils/calendar'
import { getCategoryList } from './commonState'

const cx = classNames.bind(styles)

const CalendarItemPopupEditor = ({ id, handleClose, ...item }) => {
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
		isPrivate = false,
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
	const [isPrivateState] = useToggle({ initialValue: isPrivate })

	const getActionCreator = isNewItem ? createCalendar : updateCalendar

	const handleSubmit = (e) => {
		e.preventDefault()
		const action = getActionCreator({
			calendarId,
			title: titleState,
			startAt: startAtState,
			endAt: endAtState,
			location: locationState,
			category: categoryState,
			isAllDay: isAllDayState,
			isBlocked: isBlockedState,
			isPrivate: isPrivateState,
		})

		calendarDispatch(action)

		handleClose()
	}

	useEffect(() => {}, [])

	return (
		<CalendarItemPopup id={id} handleClose={handleClose} width={474}>
			<div className={cx('component')}>
				<form className={cx('area-info')} onSubmit={handleSubmit}>
					<div className={cx('row-info')}>
						<InputSelector
							id="category"
							value={categoryState}
							list={getCategoryList()}
							handler={() => {}}
						/>
					</div>
					<div className={cx('row-info')}>
						<InputText id="title" placeholder="할 일" value={titleState} handler={handleTitleChange} />
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
					<div className={cx('row-info')}>
						<InputText
							id="location"
							placeholder="위치 정보"
							value={locationState}
							handler={handleLocationChange}
						/>
					</div>
					{isAllDayState ? (
						<div className={cx('row-info')}>
							<InputDate
								id="date-start"
								value={parseDateToString(startAtState)}
								handler={handleStartDateAtChange}
							/>
							<span className={cx('delimiter')}>~</span>
							<InputDate
								id="date-end"
								value={parseDateToString(endAtState)}
								handler={handleEndDateAtChange}
							/>
						</div>
					) : (
						<div className={cx('row-info')}>
							<InputDate
								id="time-start"
								value={parseDateToTimeString(startAtState)}
								handler={handleStartDateAtChange}
								typeTime
							/>
							<span className={cx('delimiter')}>~</span>
							<InputDate
								id="time-end"
								value={parseDateToTimeString(endAtState)}
								handler={handleEndDateAtChange}
								typeTime
							/>
						</div>
					)}
					<div className={cx('area-button')}>
						<InputCheckbox
							id="all-day"
							label="하루 종일"
							value={isAllDayState}
							handler={handleIsAllDayChange}
						/>
						<button type="button" className={cx('button', 'submit')} onClick={handleSubmit}>
							Save
						</button>
					</div>
				</form>
				<button type="button" className={cx('button', 'close')} onClick={handleClose}>
					<span className="blind">닫기</span>
					<IconClose width={15} height={15} />
				</button>
			</div>
		</CalendarItemPopup>
	)
}

export default CalendarItemPopupEditor
