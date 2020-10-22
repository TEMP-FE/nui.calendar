import React, { useState } from 'react'
import { ReactComponent as IconRepeat } from '../../assets/images/svg/icon-repeat.svg'
import { ReactComponent as IconLocation } from '../../assets/images/svg/icon-location.svg'
import { ReactComponent as IconBlock } from '../../assets/images/svg/icon-block.svg'
import { ReactComponent as IconLock } from '../../assets/images/svg/icon-lock.svg'
import { ReactComponent as IconPerson } from '../../assets/images/svg/icon-person.svg'

import classNames from 'classnames/bind'

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

// 일정 그룹 별 색상
const getCategoryColor = (group) => {
	switch (group) {
		case 'A':
			return '#009ac7'
		case 'B':
			return '#09b65a'
		case 'C':
			return '#ff5252'
		default:
			return '#fdae2e'
	}
}

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
const DayType = ({ style, ...item }) => {
	const [isPopup, setIsPopup] = useState(true)

	const { title, startAt, endAt, location, category, isAllDay, isBlocked, isPrivate, isRepeatable } = item

	const handlePopup = () => {
		setIsPopup(!isPopup)
	}

	return (
		<div className={cx('component')} draggable={!isBlocked} style={style}>
			<button
				type="button"
				className={cx('item', 'type-day')}
				style={{ backgroundColor: getCategoryColor(category) }}
				aria-haspopup="dialog"
				aria-controls="wa-popup"
				aria-expanded={isPopup}
				onClick={handlePopup}
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
			<div id="wa-popup" className={cx('popup')} role="dialog" hidden={true}>
				<div className={cx('box')} style={{ backgroundColor: getCategoryColor(category) }}>
					<div className={cx('inner')}>팝업 테스트</div>
				</div>
			</div>
		</div>
	)
}

/**
 * 기간(시간) 일정 항목
 * @param item 일정 객체
 * @returns {JSX.Element}
 * @constructor
 */
const TimeType = ({ ...item }) => {
	const [isPopup, setIsPopup] = useState(true)

	const { title, startAt, endAt, location, category, isAllDay, isBlocked, isPrivate, isRepeatable } = item

	const handlePopup = () => {
		setIsPopup(!isPopup)
	}

	return (
		<div className={cx('component')} draggable={!isBlocked}>
			<button
				type="button"
				className={cx('item')}
				aria-haspopup="dialog"
				aria-controls="wa-popup"
				aria-expanded={isPopup}
				onClick={handlePopup}
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
			<div id="wa-popup" className={cx('popup')} role="dialog" hidden={true}>
				<div className={cx('box')} style={{ backgroundColor: getCategoryColor(category) }}>
					<div className={cx('inner')}>팝업 테스트</div>
				</div>
			</div>
		</div>
	)
}

export default (Item) => (Item.isAllDay ? <DayType {...Item} /> : <TimeType {...Item} />)
