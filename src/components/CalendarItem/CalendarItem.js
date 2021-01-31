import React from 'react'
import moment from 'moment'
import classNames from 'classnames/bind'

import { ReactComponent as IconBlock } from '../../assets/images/svg/icon-block.svg'

import { CATEGORY_COLOR } from '../../constants/defaultCategory'
import CalendarDate from '../../utils/CalendarDate'

import DragSchedule from '../Drag/DragSchedule'

import styles from './CalendarItem.module.scss'

const cx = classNames.bind(styles)

const DayType = ({ schedule, handleIsShown, style, isLast }) => {
	const handleItemClick = (e) => e.stopPropagation()

	return (
		<DragSchedule
			className={cx('component')}
			isBlocked={schedule.isBlocked}
			style={style}
			index={schedule.index}
			startAt={moment(schedule.startAt)}
			endAt={moment(schedule.endAt)}
			isLast={isLast}
			category={schedule.category}
			title={schedule.title}
			onClick={handleItemClick}
		>
			<button
				type="button"
				className={cx('item', 'type-day')}
				style={{ backgroundColor: CATEGORY_COLOR[schedule.category] }}
				onClick={handleIsShown}
			>
				<span className="blind">{schedule.category}</span>
				<span className={cx('cell')}>
					<span className={cx('fixed')}>
						<span className={cx('cell', 'ellipsis')}>
							<span className="blind">
								<span className={cx('period')}>
									{CalendarDate.getDateString(schedule.startAt, 'MM-DD')}
								</span>
								<span className={cx('period')}>
									{CalendarDate.getDateString(schedule.endAt, 'MM-DD')}
								</span>
							</span>
							<span className={cx('title')}>{schedule.title}</span>
						</span>
					</span>
				</span>
				{schedule.isBlocked && (
					<span className={cx('cell', 'type-icon')}>
						<IconBlock width={10} height={10} />
					</span>
				)}
			</button>
		</DragSchedule>
	)
}

const TimeType = ({ schedule, isShown, handleIsShown }) => {
	const handleItemClick = (e) => e.stopPropagation()

	return (
		<DragSchedule
			className={cx('component')}
			isBlocked={schedule.isBlocked}
			index={schedule.index}
			isTimeType={true}
			startAt={moment(schedule.startAt)}
			endAt={moment(schedule.endAt)}
			onClick={handleItemClick}
		>
			<button
				type="button"
				className={cx('item')}
				aria-haspopup="dialog"
				aria-controls={schedule.scheduleId}
				aria-expanded={isShown}
				onClick={handleIsShown}
			>
				<span className={cx('cell', 'type-group')}>
					<span className={cx('group')} style={{ backgroundColor: CATEGORY_COLOR[schedule.category] }}>
						<span className="blind">{schedule.category}</span>
					</span>
				</span>
				<span className={cx('cell', 'type-period')}>
					<span className={cx('fixed')}>
						<span className={cx('cell', 'ellipsis')}>
							<span className={cx('period')}>
								{CalendarDate.getDateTimeString(schedule.startAt, 'hh:mm')}
							</span>
							<span className={cx('period')}>
								{CalendarDate.getDateTimeString(schedule.endAt, 'hh:mm')}
							</span>
							<span className={cx('title')}>{schedule.title}</span>
						</span>
					</span>
				</span>
				{schedule.isBlocked && (
					<span className={cx('cell', 'type-icon')}>
						<IconBlock width={10} height={10} />
					</span>
				)}
			</button>
		</DragSchedule>
	)
}

export default (props) => {
	const { style, schedule, isLast, isShown, handleIsShown } = props

	const getComponent = (isAllDay) => {
		if (isAllDay) {
			return DayType
		}

		return TimeType
	}

	const Component = getComponent(schedule.isAllDay)

	return (
		<Component style={style} schedule={schedule} isLast={isLast} isShown={isShown} handleIsShown={handleIsShown} />
	)
}
