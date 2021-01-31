import React from 'react'
import moment from 'moment'
import classNames from 'classnames/bind'

import { CATEGORY_COLOR, CATEGORY_NAME } from '../../constants/defaultCategory'
import { useInput, useToggle } from '../../hooks'

import CalendarDate from '../../utils/CalendarDate'

import styles from './Input.module.scss'

const cx = classNames.bind(styles)

export const InputCategory = ({ category, onChange, readOnly = false }) => {
	const [categoryState, setCategoryState] = useInput({
		initialValue: category,
		handleChange: (value) => {
			onChange({ property: 'category', value })
		},
	})

	return (
		<div className={cx('item-select')}>
			<span className={cx('icon')} style={{ backgroundColor: CATEGORY_COLOR[category] }} />
			<select defaultChecked={categoryState} onChange={setCategoryState} disabled={readOnly}>
				{Object.keys(CATEGORY_NAME).map((option) => (
					<option value={option} key={option}>
						{option}
					</option>
				))}
			</select>
			<div hidden={true}>그룹 레이어</div>
		</div>
	)
}

export const InputTitle = ({ title, onChange, readOnly = false }) => {
	const [titleState, setTitleState] = useInput({
		initialValue: title,
		handleChange: (value) => {
			onChange({ property: 'title', value })
		},
	})

	return (
		<div className={cx('item-input')}>
			<input type="text" placeholder="일정" value={titleState} onChange={setTitleState} readOnly={readOnly} />
		</div>
	)
}

export const InputIsBlocked = ({ isBlocked, onChange }) => {
	const [isBlockedState, setIsBlockedState] = useToggle({
		initialValue: isBlocked,
		handleChange: (value) => {
			onChange({ property: 'isBlocked', value })
		},
	})

	return (
		<button type="button" className={cx('button')} onClick={setIsBlockedState}>
			{isBlockedState ? '잠금해제' : '잠금'}
		</button>
	)
}

export const InputDate = ({ date, property, typeTime = false, readOnly = false, onChange }) => {
	const [dateState, setDateState] = useInput({
		initialValue: date,
		valueFilter: (value) => {
			if (typeTime) {
				const [hours, minutes] = value.split(':')
				const formattedDate = new Date(date)

				formattedDate.setHours(hours)
				formattedDate.setMinutes(minutes)

				return formattedDate
			}

			return value
		},
		handleChange: (value) => {
			onChange({ property, value: moment(value) })
		},
	})

	return (
		<div className={cx('item-input')}>
			<label htmlFor={`property-${property}`} className={cx('icon')} />
			<input
				id={`property-${property}`}
				type={typeTime ? 'time' : 'date'}
				value={typeTime ? CalendarDate.getDateTimeString(dateState) : CalendarDate.getDateString(dateState)}
				onChange={setDateState}
				readOnly={readOnly}
			/>
		</div>
	)
}

export const InputIsAllDay = ({ isAllDay, onChange, readOnly = false }) => {
	const [isAllDayState, setIsAllDayState] = useToggle({
		initialValue: isAllDay,
		handleChange: (value) => {
			onChange({ property: 'isAllDay', value })
		},
	})

	return (
		<div className={cx('item-checkbox')}>
			<span className={cx('label')}>하루종일 :</span>
			<input
				id="isAllDay"
				type="checkbox"
				className="blind"
				checked={isAllDayState}
				onChange={setIsAllDayState}
				readOnly={readOnly}
			/>
			<label htmlFor="isAllDay" onClick={setIsAllDayState}>
				<span className="blind">하루종일 :</span>
			</label>
		</div>
	)
}

export default {
	InputCategory,
	InputTitle,
	InputIsBlocked,
	InputDate,
	InputIsAllDay,
}
