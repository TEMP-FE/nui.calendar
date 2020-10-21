import React, { useState } from 'react'
import { ReactComponent as IconLabel } from '../../assets/images/svg/icon-label.svg'
import { ReactComponent as IconLock } from '../../assets/images/svg/icon-lock.svg'
import { ReactComponent as IconLockOpen } from '../../assets/images/svg/icon-lock-open.svg'
import { ReactComponent as IconLocation } from '../../assets/images/svg/icon-location.svg'
import { ReactComponent as IconCalendar } from '../../assets/images/svg/icon-calendar.svg'
import { ReactComponent as IconTime } from '../../assets/images/svg/icon-time.svg'
import { ReactComponent as IconClose } from '../../assets/images/svg/icon-close.svg'
import CalendarItemPopup from './CalendarItemPopup'

import classNames from 'classnames/bind'
import { getCategoryColor } from './commonState'
import useInput from './useInput'
import useToggle from './useToggle'

import styles from './CalendarItemPopupEditor.module.scss'

const cx = classNames.bind(styles)

const CalendarItemPopupEditor = ({ id, isShown, handleClose, ...item }) => {
	const {
		title = '',
		startAt = new Date(),
		endAt = new Date(),
		location = '',
		category = 'A',
		isAllDay = false,
		isBlocked = false,
		isPrivate = false,
		isRepeatable = false,
	} = item

	const handleSubmit = (e) => {
		e.preventDefault()
	}

	const [titleState, setTitleState, handleTitleChange] = useInput({ initialValue: title })
	const [startDateAtState, setStartDateAtState, handleStartDateAtChange] = useInput({ initialValue: startAt })
	const [endDateAtState, setEndDateAtState, handleEndDateAtChange] = useInput({ initialValue: endAt })
	const [locationState, setLocationState, handleLocationChange] = useInput({ initialValue: location })
	const [categoryState, setCategoryState, handleCategoryChange] = useInput({ initialValue: category })
	const [isAllDayState, setIsAllDayState, handleIsAllDayChange] = useToggle({ initialValue: isAllDay })
	const [isBlockedState, setIsBlockedState, handleIsBlockedChange] = useToggle({ initialValue: isBlocked })
	const [isPrivateState, setIsPrivateState, handleIsPrivateChange] = useToggle({ initialValue: isPrivate })

	return (
		<CalendarItemPopup id={id} isShown={isShown} width={474}>
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
								defaultValue={startDateAtState}
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
								defaultValue={endDateAtState}
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
						<button type="button" className={cx('button', 'submit')}>
							Save
						</button>
					</div>
				</form>
				<button type="submit" className={cx('button', 'close')} onClick={handleClose}>
					<span className="blind">닫기</span>
					<IconClose width={15} height={15} />
				</button>
			</div>
		</CalendarItemPopup>
	)
}

export default CalendarItemPopupEditor
