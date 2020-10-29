import React, { useState } from 'react'
import { ReactComponent as IconRepeat } from '../../assets/images/svg/icon-repeat.svg'
import { ReactComponent as IconLocation } from '../../assets/images/svg/icon-location.svg'
import { ReactComponent as IconBlock } from '../../assets/images/svg/icon-block.svg'
import { ReactComponent as IconLock } from '../../assets/images/svg/icon-lock.svg'
import { ReactComponent as IconPerson } from '../../assets/images/svg/icon-person.svg'
import CalendarItemPopupInfo from './CalendarItemPopupInfo'
import CalendarItemPopupEditor from './CalendarItemPopupEditor'

import classNames from 'classnames/bind'
import { getCategoryColor } from './commonState'

import styles from './CalendarItem.module.scss'

const cx = classNames.bind(styles)

/*
    const calendarItem = {
        title: '',
        startAt: new Date(),
        endAt: new Date(),
        location: '',
        category: '',
        isAllDay: false,
        isBlocked: false,
        isPrivate: false,
        isRepeatable: false,
    }
*/

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
const DayType = ({ handleEdit = () => {}, ...item }) => {
	const { title, startAt, endAt, location, category, isAllDay, isBlocked, isPrivate, isRepeatable } = item

	const [isShown, setIsShown] = useState(false)

	const handleIsShown = () => {
		setIsShown(!isShown)
	}

	const handleDelete = () => {}

	return (
		<div className={cx('component')} draggable={!isBlocked}>
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
			<CalendarItemPopupInfo
				id={'wa-popup'}
				isShown={isShown}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
				{...item}
			/>
		</div>
	)
}

/**
 * 기간(시간) 일정 항목
 * @param item 일정 객체
 * @returns {JSX.Element}
 * @constructor
 */
const TimeType = ({ handleEdit = () => {}, ...item }) => {
	const { title, startAt, endAt, location, category, isAllDay, isBlocked, isPrivate, isRepeatable } = item

	const [isShown, setIsShown] = useState(false)

	const handleIsShown = () => {
		setIsShown(!isShown)
	}

	const handleEditInPopup = () => {
		setIsShown(!isShown)

		handleEdit()
	}

	const handleDelete = () => {}

	return (
		<div className={cx('component')} draggable={!isBlocked}>
			<button
				type="button"
				className={cx('item')}
				aria-haspopup="dialog"
				aria-controls="wa-popup"
				aria-expanded={isShown}
				onClick={handleIsShown}
			>
				<span className={cx('cell', 'type-group')}>
					<span className={cx('group')} style={{ backgroundColor: getCategoryColor(category) }}>
						<span className="blind">{category}</span>
					</span>
				</span>
				<span className={cx('cell', 'type-period')}>
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
			<CalendarItemPopupInfo
				id={'wa-popup'}
				isShown={isShown}
				handleIsShown={handleIsShown}
				handleEdit={handleEditInPopup}
				handleDelete={handleDelete}
				{...item}
			/>
		</div>
	)
}

export default (Item) => (Item.isAllDay ? <DayType {...Item} /> : <TimeType {...Item} />)
