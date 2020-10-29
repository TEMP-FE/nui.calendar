import React, { useEffect } from 'react'

import classNames from 'classnames/bind'

import styles from './CalendarItemPopup.module.scss'

const cx = classNames.bind(styles)

const CalendarItemPopup = ({ id, width, backgroundColor, isShown, handleClose, children }) => {
	// TODO: 레이어 상하좌우 위치 조정 Func...
	const clickHandler = (e) => {
		e.stopPropagation()
	}

	const handleCloser = () => {
		handleClose()
	}

	useEffect(() => {
		window.addEventListener('click', handleCloser)

		return () => {
			window.removeEventListener('click', handleCloser)
		}
	}, [])

	return (
		<div id={id} className={cx('component', { 'is-show': isShown })} onClick={clickHandler} role="dialog">
			<div className={cx('inner')} style={{ width, backgroundColor: backgroundColor }}>
				{children}
			</div>
		</div>
	)
}

export default CalendarItemPopup
