import React, { useState } from 'react'
import { ReactComponent as IconRepeat } from '../../assets/images/svg/icon-repeat.svg'
import { ReactComponent as IconLocation } from '../../assets/images/svg/icon-location.svg'
import { ReactComponent as IconBlock } from '../../assets/images/svg/icon-block.svg'
import { ReactComponent as IconLock } from '../../assets/images/svg/icon-lock.svg'
import { ReactComponent as IconPerson } from '../../assets/images/svg/icon-person.svg'
import CalendarItemPopupInfo from './CalendarItemPopupInfo'

import classNames from 'classnames/bind'
import { getCategoryColor } from './commonState'

import styles from './CalendarItem.module.scss'
import moment from 'moment'
import { useCalenderContext } from '../../contexts/calendar'

const cx = classNames.bind(styles)


const getIcon = ({ isPrivate, hasLocation, isBlocked, isRepeatable }) => {
	// 반복 일정
	if (isRepeatable) {
		return <IconRepeat width={10} height={10} />
	}

	// 수정 불가 일정
	if (isBlocked) {
		return <IconBlock width={10} height={10} />
	}

	// 위치 지정 일정
	if (hasLocation) {
		return <IconLocation width={10} height={10} />
	}

	// if 개인 일정 else 공개 일정
	if (isPrivate === 'private') {
		return <IconLock width={10} height={10} />
	} else {
		return <IconPerson width={10} height={10} />
	}
}

/**
 * 기간(종일) 일정 항목
 * @param item 일정 객체
 * @returns {JSX.Element}
 * @constructor
 */
const DayType = ({ handleClose, setDragging, resetDragging, ...item }) => {
	const [isPopup, setIsPopup] = useState(true)
	const { title, startAt, endAt, location, category, isAllDay, isBlocked, isPrivate, isRepeatable } = item

	const [isShown, setIsShown] = useState(false)

	const handleItemClick = (e) => e.stopPropagation()

	const handleIsShown = () => {
		setIsShown(!isShown)
	}

	const handleDragStart = (e) => {
		setDragging()
	}

	const handleDragEnd = (e) => {
		resetDragging()
	}
	const handleDelete = () => { }
	return (
		<div className={cx('component')} draggable={!isBlocked}
			onClick={handleItemClick}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<button
				type="button"
				className={cx('item', 'type-day')}
				style={{ backgroundColor: getCategoryColor(category) }}
				aria-haspopup="dialog"
				aria-controls={'wa-popup'}
				aria-expanded={isShown}
				onClick={handleIsShown}
			>
				<span className="blind">{category}</span>
				<span className="blind">
					<span className={cx('period')}>{startAt}</span>
					<span className={cx('period')}>{endAt}</span>
				</span>
				<span className={cx('cell', 'type-icon')}>{getIcon(item)}</span>
				<span className={cx('cell')}>
					<span className={cx('fixed')}>
						<span className={cx('cell', 'ellipsis')}>
							<span className={cx('title')}>{title}</span>
						</span>
					</span>
				</span>
			</button>
			{isShown && (
				<CalendarItemPopupInfo
					id={'wa-popup'}
					isShown={isShown}
					handleClose={handleClose}
					handleDelete={handleDelete}
					{...item}
				/>
			)}
		</div>
	)
}

/**
 * 기간(시간) 일정 항목
 * @param item 일정 객체
 * @returns {JSX.Element}
 * @constructor
 */
const TimeType = ({ handleEdit, ...item }) => {
	const { calendarDispatch } = useCalenderContext()
	const [isInfoShown, setIsInfoShown] = useState(false)

	const {
		calendarId,
		title,
		dateInfo,
		dateRelative,
		location,
		category,
		isAllDay,
		isBlocked,
		isPrivate,
		// isRepeatable = false,
	} = item

	const startDateAt = moment(dateInfo).format('MM-DD')
	const endDateAt = moment(dateInfo).add(dateRelative, 'days').format('MM-DD')

	const handleItemClick = (e) => e.stopPropagation()

	const handleIsInfoShown = () => {
		setIsInfoShown(!isInfoShown)
	}
	console.log(handleEdit)
	const handleEditInPopup = () => {
		setIsInfoShown(!isInfoShown)

		handleEdit()
	}

	return (
		<div className={cx('component')} onClick={handleItemClick} draggable={!isBlocked}>
			<button
				type="button"
				className={cx('item')}
				aria-haspopup="dialog"
				aria-controls="wa-popup"
				aria-expanded={isInfoShown}
				onClick={handleIsInfoShown}
			>
				<span className={cx('cell', 'type-group')}>
					<span className={cx('group')} style={{ backgroundColor: getCategoryColor(category) }}>
						<span className="blind">{category}</span>
					</span>
				</span>
				<span className={cx('cell', 'type-period')}>
					<span className={cx('period')}>{startDateAt}</span>
					<span className={cx('period')}>{endDateAt}</span>
				</span>
				<span className={cx('cell', 'type-icon')}>{getIcon(item)}</span>
				<span className={cx('cell')}>
					<span className={cx('fixed')}>
						<span className={cx('cell', 'ellipsis')}>
							<span className={cx('title')}>{title}</span>
						</span>
					</span>
				</span>
			</button>
			{isInfoShown && (
				<CalendarItemPopupInfo
					id={'wa-popup'}
					handleIsShown={handleIsInfoShown}
					handleEdit={handleEditInPopup}
					handleClose={handleIsInfoShown}
					{...item}
				/>
			)}
		</div>
	)
}

export default (Item) => (Item.isAllDay ? <DayType {...Item} /> : <TimeType {...Item} />)
