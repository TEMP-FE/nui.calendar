import React, { useEffect } from 'react'
import { ReactComponent as IconLabel } from '../../assets/images/svg/icon-label.svg'
import { ReactComponent as IconLock } from '../../assets/images/svg/icon-lock.svg'
import { ReactComponent as IconLockOpen } from '../../assets/images/svg/icon-lock-open.svg'
import { ReactComponent as IconLocation } from '../../assets/images/svg/icon-location.svg'
import { ReactComponent as IconCalendar } from '../../assets/images/svg/icon-calendar.svg'
import { ReactComponent as IconTime } from '../../assets/images/svg/icon-time.svg'
import { ReactComponent as IconClose } from '../../assets/images/svg/icon-close.svg'
import CalendarItemPopup from './CalendarItemPopup'

import moment from 'moment'
import classNames from 'classnames/bind'
import { getCategoryColor } from './commonState'
import { useCalendarContext } from '../../contexts/calendar'
import { createCalendar, updateCalendar } from '../../reducers/calendar'
import useInput from './useInput'
import useToggle from './useToggle'

import styles from './CalendarItemPopupEditor.module.scss'

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
		const year = parseInt(moment(e.target.value).format('YY'))
		const month = parseInt(moment(e.target.value).format('MM'))
		const date = parseInt(moment(e.target.value).format('DD'))

		return new Date(year, month, date)
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
						<div className={cx('item-input', 'category')}>
							<span
								className={cx('icon', 'category')}
								style={{ backgroundColor: getCategoryColor(categoryState) }}
							/>
							<button type="button" className={cx('button', 'category')}>
								{categoryState}
							</button>
							<div hidden={true}>그룹 레이어</div>
						</div>
					</div>
					<div className={cx('row-info')}>
						<div className={cx('item-input', 'full')}>
							<label htmlFor="f-title" className={cx('icon')}>
								<IconLabel width={10} height={10} />
							</label>
							<input
								id="f-title"
								type="text"
								placeholder="Title"
								defaultValue={titleState}
								onChange={handleTitleChange}
							/>
						</div>
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
						<div className={cx('item-input', 'full')}>
							<label htmlFor="f-location" className={cx('icon')}>
								<IconLocation width={10} height={10} />
							</label>
							<input
								id="f-location"
								type="text"
								placeholder="location"
								defaultValue={locationState}
								onChange={handleLocationChange}
							/>
						</div>
					</div>
					<div className={cx('row-info')}>
						<div className={cx('item-input')}>
							<label htmlFor="f-date-start" className={cx('icon')}>
								<IconCalendar width={10} height={10} />
							</label>
							<input
								id="f-date-start"
								type="date"
								placeholder="location"
								defaultValue={startAtState.toISOString().substr(0, 10)}
								onChange={handleStartDateAtChange}
							/>
						</div>
						<span className={cx('delimiter')}>~</span>
						<div className={cx('item-input')}>
							<label htmlFor="f-date-end" className={cx('icon')}>
								<IconCalendar width={10} height={10} />
							</label>
							<input
								id="f-date-end"
								type="date"
								placeholder="location"
								defaultValue={endAtState.toISOString().substr(0, 10)}
								onChange={handleEndDateAtChange}
							/>
						</div>
					</div>
					{!isAllDayState && (
						<div className={cx('row-info')}>
							<div className={cx('item-input')}>
								<label htmlFor="f-time-start" className={cx('icon')}>
									<IconTime width={10} height={10} />
								</label>
								<input id="f-time-start" type="time" placeholder="location" />
							</div>
							<span className={cx('delimiter')}>~</span>
							<div className={cx('item-input')}>
								<label htmlFor="f-time-end" className={cx('icon')}>
									<IconTime width={10} height={10} />
								</label>
								<input id="f-time-end" type="time" placeholder="location" />
							</div>
						</div>
					)}
					<div className={cx('area-button')}>
						<div className={cx('item-checkbox')}>
							<input
								id="f-allday"
								type="checkbox"
								defaultChecked={isAllDayState}
								onChange={handleIsAllDayChange}
							/>
							<label htmlFor="f-allday">All day</label>
						</div>
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
