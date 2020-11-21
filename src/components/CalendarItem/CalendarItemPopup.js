import React, { useEffect } from 'react'

import classNames from 'classnames/bind'

import styles from './CalendarItemPopup.module.scss'

const cx = classNames.bind(styles)

const CalendarItemPopup = ({ id, width, backgroundColor, handleClose, children }) => {
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
		<div id={id} className={cx('component')} role="dialog">
			<div className={cx('layer')} onClick={clickHandler}>
				<div className={cx('inner')} style={{ width, backgroundColor: backgroundColor }}>
					{children}
				</div>
			</div>
		</div>
	)
}

export default CalendarItemPopup
