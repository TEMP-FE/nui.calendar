import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import classNames from 'classnames/bind'

import styles from './CalendarItemPopupPortal.module.scss'

const cx = classNames.bind(styles)

const CalendarItemPopupPortal = ({ id, width, handleClose, children }) => {
	const [target, setTarget] = useState(null)

	useEffect(() => {
		const cellElement = document.getElementById(id)

		setTarget(cellElement)
	}, [])

	const componentRef = useRef(null)

	useEffect(() => {
		setIsShow(true)
	}, [])

	const [isShow, setIsShow] = useState(false)

	const clickHandler = (e) => {
		e.stopPropagation()
	}
	useEffect(() => {
		window.addEventListener('click', handleClose)

		return () => {
			window.removeEventListener('click', handleClose)
		}
	}, [handleClose])

	return (
		target &&
		ReactDOM.createPortal(
			<div ref={componentRef} className={cx('component')} role="dialog">
				<div className={cx('layer', { hide: !isShow })} onClick={clickHandler}>
					<div className={cx('inner')} style={{ width }}>
						{children}
					</div>
				</div>
			</div>,
			target,
		)
	)
}

export default CalendarItemPopupPortal
