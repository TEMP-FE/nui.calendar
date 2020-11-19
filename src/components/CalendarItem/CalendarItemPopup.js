import React, { useEffect } from 'react'

import classNames from 'classnames/bind'

import styles from './CalendarItemPopup.module.scss'

const cx = classNames.bind(styles)

const CalendarItemPopup = ({ id, width, backgroundColor, handleClose, children }) => {
	// TODO: 레이어 상하좌우 위치 조정 Func...
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
		<div id={id} className={cx('component')} onClick={clickHandler} role="dialog">
			<div className={cx('inner')} style={{ width, backgroundColor: backgroundColor }}>
				{children}
			</div>
		</div>
	)
}

export default CalendarItemPopup
