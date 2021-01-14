import React from 'react'
import { ReactComponent as IconBlock } from '../../assets/images/svg/icon-block.svg'
import DragSchedule from '../Drag/DragSchedule'

import classNames from 'classnames/bind'
import { getCategoryColor } from './commonState'

import styles from './CalendarItem.module.scss'
import moment from 'moment'

const cx = classNames.bind(styles)

const DayType = ({ handleIsShown, style, isLast, ...item }) => {
	const { title, startAt, endAt, category, isBlocked, index } = item

	const handleItemClick = (e) => e.stopPropagation()

	return (
		<DragSchedule
			className={cx('component')}
			isBlocked={isBlocked}
			style={style}
			index={index}
			startAt={moment(startAt)}
			endAt={moment(endAt)}
			isLast={isLast}
			onClick={handleItemClick}
		>
			<button
				type="button"
				className={cx('item', 'type-day')}
				style={{ backgroundColor: getCategoryColor(category) }}
				onClick={handleIsShown}
			>
				<span className="blind">{category}</span>
				<span className={cx('cell')}>
					<span className={cx('fixed')}>
						<span className={cx('cell', 'ellipsis')}>
							<span className="blind">
								<span className={cx('period')}>{moment(startAt).format('MM-DD')}</span>
								<span className={cx('period')}>{moment(endAt).format('MM-DD')}</span>
							</span>
							<span className={cx('title')}>{title}</span>
						</span>
					</span>
				</span>
				{isBlocked && (
					<span className={cx('cell', 'type-icon')}>
						<IconBlock width={10} height={10} />
					</span>
				)}
			</button>
		</DragSchedule>
	)
}

const TimeType = ({ handleIsShown, ...item }) => {
	const { title, startAt, endAt, category, isBlocked } = item

	const handleItemClick = (e) => e.stopPropagation()

	return (
		<div className={cx('component')} onClick={handleItemClick} draggable={!isBlocked}>
			<button type="button" className={cx('item')} onClick={handleIsShown}>
				<span className={cx('cell', 'type-group')}>
					<span className={cx('group')} style={{ backgroundColor: getCategoryColor(category) }}>
						<span className="blind">{category}</span>
					</span>
				</span>
				<span className={cx('cell', 'type-period')}>
					<span className={cx('fixed')}>
						<span className={cx('cell', 'ellipsis')}>
							<span className={cx('period')}>{moment(startAt).format('h:mm')}</span>
							<span className={cx('period')}>{moment(endAt).format('h:mm')}</span>
							<span className={cx('title')}>{title}</span>
						</span>
					</span>
				</span>
				{isBlocked && (
					<span className={cx('cell', 'type-icon')}>
						<IconBlock width={10} height={10} />
					</span>
				)}
			</button>
		</div>
	)
}

export default (Item) => (Item.isAllDay ? <DayType {...Item} /> : <TimeType {...Item} />)
