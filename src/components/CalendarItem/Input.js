import React from 'react'
import classNames from 'classnames/bind'

import styles from './Input.module.scss'
import { ReactComponent as IconLabel } from '../../assets/images/svg/icon-label.svg'
import { ReactComponent as IconCalendar } from '../../assets/images/svg/icon-calendar.svg'
import { ReactComponent as IconTime } from '../../assets/images/svg/icon-time.svg'
import { getCategoryColor } from './commonState'

const cx = classNames.bind(styles)

export const InputText = ({ id, placeholder, value, handler }) => {
	const textId = `text-${id}`

	return (
		<div className={cx('item-input')}>
			<label htmlFor={textId} className={cx('icon')}>
				<IconLabel width={10} height={10} />
			</label>
			<input id={textId} type="text" placeholder={placeholder} defaultValue={value} onChange={handler} />
		</div>
	)
}

export const InputCheckbox = ({ id, label, value, handler }) => {
	const checkboxId = `checkbox-${id}`

	return (
		<div className={cx('item-checkbox')}>
			<input id={checkboxId} type="checkbox" className="blind" checked={value} readOnly />
			<label htmlFor={checkboxId} onClick={handler}>
				<span className="blind">{label}</span>
			</label>
		</div>
	)
}

export const InputDate = ({ id, value, handler, typeTime = false }) => {
	const dateId = `date-${id}`

	return (
		<div className={cx('item-input')}>
			<label htmlFor={dateId} className={cx('icon')}>
				{typeTime ? <IconTime width={10} height={10} /> : <IconCalendar width={10} height={10} />}
			</label>
			<input id={dateId} type={typeTime ? 'time' : 'date'} value={value} onChange={handler} />
		</div>
	)
}

export const InputSelector = ({ id, value, list, handler }) => {
	const selectorId = `selector-${id}`

	return (
		<div className={cx('item-select')}>
			<span className={cx('icon', 'category')} style={{ backgroundColor: getCategoryColor(value) }} />
			<select id={selectorId} defaultChecked={value} onChange={handler}>
				{list &&
					list.map((option) => (
						<option value={option} key={option}>
							{option}
						</option>
					))}
			</select>
			<div hidden={true}>그룹 레이어</div>
		</div>
	)
}

export default {
	InputText,
	InputCheckbox,
	InputDate,
	InputSelector,
}
