import React, { useEffect, useRef, useState } from 'react'

import classNames from 'classnames/bind'

import styles from './CalendarItemPopup.module.scss'

const cx = classNames.bind(styles)

const CalendarItemPopup = ({ id, width, backgroundColor, handleClose, children }) => {
	const componentRef = useRef(null)

	const calendarArea = document.getElementById('calendar')

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
		<div id={id} ref={componentRef} className={cx('component')} role="dialog">
			<div className={cx('layer', { hide: !isShow })} onClick={clickHandler}>
				<div className={cx('inner')} style={{ width, backgroundColor: backgroundColor }}>
					{children}
				</div>
			</div>
		</div>
	)
}

export default CalendarItemPopup
