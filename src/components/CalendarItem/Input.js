import React from 'react'
import classNames from 'classnames/bind'

import styles from './Input.module.scss'
import { getCategoryColor } from './commonState'

const cx = classNames.bind(styles)

export const InputText = ({ id, placeholder, value, handler, readOnly = false }) => {
	const textId = `text-${id}`

	return (
		<div className={cx('item-input')}>
			<input
				id={textId}
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={handler}
				readOnly={readOnly}
			/>
		</div>
	)
}

export const InputCheckbox = ({ id, label, value, handler, readOnly = false }) => {
	const checkboxId = `checkbox-${id}`

	return (
		<div className={cx('item-checkbox')}>
			<input
				id={checkboxId}
				type="checkbox"
				className="blind"
				checked={value}
				onChange={() => {}}
				readOnly={readOnly}
			/>
			<label htmlFor={checkboxId} onClick={handler}>
				<span className="blind">{label}</span>
			</label>
		</div>
	)
}

export const InputDate = ({ id, value, handler, typeTime = false, readOnly = false }) => {
	const dateId = `date-${id}`

	return (
		<div className={cx('item-input')}>
			<label htmlFor={dateId} className={cx('icon')} />
			<input id={dateId} type={typeTime ? 'time' : 'date'} value={value} onChange={handler} readOnly={readOnly} />
		</div>
	)
}

export const InputSelector = ({ id, value, list, handler, readOnly = false }) => {
	const selectorId = `selector-${id}`

	return (
		<div className={cx('item-select')}>
			<span className={cx('icon')} style={{ backgroundColor: getCategoryColor(value) }} />
			<select id={selectorId} defaultChecked={value} onChange={handler} disabled={readOnly}>
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
