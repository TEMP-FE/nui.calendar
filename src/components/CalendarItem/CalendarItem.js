import React from 'react'
import moment from 'moment'
import classNames from 'classnames/bind'

import { ReactComponent as IconBlock } from '../../assets/images/svg/icon-block.svg'

import { getCategoryColor } from './commonState'
import CalendarDate from '../../utils/CalendarDate'

import DragSchedule from '../Drag/DragSchedule'

import styles from './CalendarItem.module.scss'

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
			category={category}
			title={title}
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
								<span className={cx('period')}>{CalendarDate.getDateString(startAt, 'MM-DD')}</span>
								<span className={cx('period')}>{CalendarDate.getDateString(endAt, 'MM-DD')}</span>
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

const TimeType = ({ isShown, handleIsShown, handleEdit, ...item }) => {
	const { id, title, startAt, endAt, category, isBlocked, index, scheduleStartAt, scheduleEndAt } = item

	const handleItemClick = (e) => e.stopPropagation()

	return (
		<DragSchedule
			className={cx('component')}
			isBlocked={isBlocked}
			index={index}
			isTimeType={true}
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
					<span className={cx('fixed')}>
						<span className={cx('cell', 'ellipsis')}>
							<span className={cx('period')}>{CalendarDate.getDateTimeString(startAt, 'h:mm')}</span>
							<span className={cx('period')}>{CalendarDate.getDateTimeString(endAt, 'h:mm')}</span>
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

export default (Item) => (Item.isAllDay ? <DayType {...Item} /> : <TimeType {...Item} />)
