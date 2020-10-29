import React from 'react'
import { ReactComponent as IconLocation } from '../../assets/images/svg/icon-location.svg'
import { ReactComponent as IconLock } from '../../assets/images/svg/icon-lock.svg'
import { ReactComponent as IconPerson } from '../../assets/images/svg/icon-person.svg'

import classNames from 'classnames/bind'
import { getCategoryColor } from './commonState'
import { deleteCalendar } from '../../reducers/calendar'

import styles from './CalendarItemPopupInfo.module.scss'
import CalendarItemPopup from './CalendarItemPopup'
import { useCalenderContext } from '../../contexts/calendar'

const cx = classNames.bind(styles)

const CalendarItemPopupInfo = ({ id, isShown, handleEdit, handleDelete, ...item }) => {
	const { calendarDispatch } = useCalenderContext()

	const { title, startAt, endAt, location, category, isAllDay, isBlocked, isPrivate, isRepeatable } = item

	const onDelete = () => {
		calendarDispatch(deleteCalendar(id))

		handleDelete()
	}

	return (
		<CalendarItemPopup id={id} backgroundColor={getCategoryColor(category)} isShown={isShown}>
			<div className={cx('component')}>
				<strong className={cx('title')}>{title}</strong>
				<div className={cx('period')}>
					{startAt} ~ {endAt}
				</div>
				<dl className={cx('list-info')}>
					{location && (
						<div className={cx('item-info')}>
							<dt className={cx('icon')}>
								<IconLocation width={10} height={10} />
							</dt>
							<dd className={cx('info')}>{location}</dd>
						</div>
					)}
					<div className={cx('item-info')}>
						<dt className={cx('icon')}>
							{isPrivate ? <IconLock width={10} height={10} /> : <IconPerson width={10} height={10} />}
						</dt>
						<dd className={cx('info')}>{isPrivate ? 'private' : 'anyone'}</dd>
					</div>
					<div className={cx('item-info')}>
						<dt className={cx('icon')}>
							<span className={cx('category')} style={{ backgroundColor: getCategoryColor(category) }}>
								<span className="blind">카테고리</span>
							</span>
						</dt>
						<dd className={cx('info')}>{category}</dd>
					</div>
				</dl>
				<div className={cx('area-button')}>
					<div className={cx('cell')}>
						<button type="button" className={cx('button')} onClick={handleEdit}>
							Edit
						</button>
					</div>
					<div className={cx('cell')}>
						<button type="button" className={cx('button')} onClick={onDelete}>
							Delete
						</button>
					</div>
				</div>
			</div>
		</CalendarItemPopup>
	)
}

export default CalendarItemPopupInfo
