import React from 'react'
import { ReactComponent as IconRepeat } from '../../assets/images/svg/icon-repeat.svg'
import { ReactComponent as IconLocation } from '../../assets/images/svg/icon-location.svg'
import { ReactComponent as IconBlock } from '../../assets/images/svg/icon-block.svg'
import DragSchedule from '../Drag/DragSchedule'

import classNames from 'classnames/bind'
import { getCategoryColor } from './commonState'

import styles from './CalendarItem.module.scss'
import moment from 'moment'

const cx = classNames.bind(styles)

const getIcon = ({ hasLocation, isBlocked, isRepeatable }) => {
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
}

const DayType = ({ isShown, handleIsShown, style, isLast, ...item }) => {
	const { id, title, startAt, endAt, category, isBlocked, index, scheduleStartAt, scheduleEndAt } = item

	const handleItemClick = (e) => e.stopPropagation()

	return (
		<DragSchedule
			className={cx('component')}
			isBlocked={isBlocked}
			style={style}
			index={index}
			startAt={moment(scheduleStartAt)}
			endAt={moment(scheduleEndAt)}
			isLast={isLast}
			onClick={handleItemClick}
		>
			<button
				type="button"
				className={cx('item', 'type-day')}
				style={{ backgroundColor: getCategoryColor(category) }}
				aria-haspopup="dialog"
				aria-controls={id}
				aria-expanded={isShown}
				onClick={handleIsShown}
			>
				<span className="blind">{category}</span>
				<span className="blind">
					<span className={cx('period')}>{moment(startAt).format('MM-DD')}</span>
					<span className={cx('period')}>{moment(endAt).format('MM-DD')}</span>
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
		</DragSchedule>
	)
}

const TimeType = ({ isShown, handleIsShown, handleEdit, ...item }) => {
	const {
		id,
		title,
		startAt,
		endAt,
		category,
		isBlocked,
		index,
		scheduleStartAt,
		scheduleEndAt
		// isRepeatable = false,
	} = item

	const handleItemClick = (e) => e.stopPropagation()

	return (
		<DragSchedule
			className={cx('component')}
			isBlocked={isBlocked}
			index={index}
			startAt={moment(scheduleStartAt)}
			endAt={moment(scheduleEndAt)}
			onClick={handleItemClick}
		>
			<button
				type="button"
				className={cx('item')}
				aria-haspopup="dialog"
				aria-controls={id}
				aria-expanded={isShown}
				onClick={handleIsShown}
			>
				<span className={cx('cell', 'type-group')}>
					<span className={cx('group')} style={{ backgroundColor: getCategoryColor(category) }}>
						<span className="blind">{category}</span>
					</span>
				</span>
				<span className={cx('cell', 'type-period')}>
					<span className={cx('period')}>{moment(startAt).format('h:mm')}</span>
					<span className={cx('period')}>{moment(endAt).format('h:mm')}</span>
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
		</DragSchedule>
	)
}

export default (Item) => (Item.isAllDay ? <DayType {...Item} /> : <TimeType {...Item} />)
