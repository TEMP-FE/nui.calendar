import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import classNames from 'classnames/bind'

import styles from './CalendarItemPopupPortal.module.scss'

const cx = classNames.bind(styles)

const POPUP_MAX_WIDTH = 300

const CalendarItemPopupPortal = ({ id, width, handleClose, children }) => {
	const [target, setTarget] = useState(null)
	const [position, setPosition] = useState(null)
	const componentRef = useRef(null)

	// Select cell target element
	useEffect(() => {
		const cellElement = document.getElementById(id)
		const calendarContainer = document.getElementById('calendar-container')
		const { width: containerWidth } = calendarContainer.getBoundingClientRect()
		const { x: targetX, width: targetWidth } = cellElement.getBoundingClientRect()

		if (containerWidth - (targetX + targetWidth) <= POPUP_MAX_WIDTH) {
			setPosition('direction-left')
		}

		setTarget(cellElement)
	}, [id])

	const [isShow, setIsShow] = useState(false)

	// Popup toggle
	useEffect(() => {
		setIsShow(true)
	}, [])

	useEffect(() => {
		window.addEventListener('click', handleClose)

		return () => {
			window.removeEventListener('click', handleClose)
		}
	}, [handleClose])

	const clickHandler = (e) => {
		e.stopPropagation()
	}

	return (
		target &&
		ReactDOM.createPortal(
			<>
				<div className={cx('dimmed')} />
				<div ref={componentRef} className={cx('component', { [position]: position })} role="dialog">
					<div className={cx('layer', { hide: !isShow })} onClick={clickHandler}>
						<div className={cx('inner')} style={{ width }}>
							{children}
						</div>
					</div>
				</div>
			</>,
			target,
		)
	)
}

export default CalendarItemPopupPortal
