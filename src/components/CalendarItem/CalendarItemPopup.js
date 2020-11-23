import React, { useEffect, useRef, useState } from 'react'

import classNames from 'classnames/bind'

import styles from './CalendarItemPopup.module.scss'

const cx = classNames.bind(styles)

const POSITION_CLASS = {
	TOP: cx('top'),
	BOTTOM: cx('bottom'),
	LEFT: cx('left'),
}

const CalendarItemPopup = ({ id, width, backgroundColor, handleClose, children }) => {
	const componentRef = useRef(null)
	const [positionClass, setPositionClass] = useState(null)

	const calendarArea = document.getElementById('calendar')

	const getPositionClass = ({ top, right }) => {
		const componentRefRect = componentRef.current.getBoundingClientRect()

		const topOffset = componentRefRect.top - top > 300
		const rightOffset = right - componentRefRect.right > 300

		const classNames = []

		if (topOffset) {
			classNames.push(POSITION_CLASS.TOP)
		} else {
			classNames.push(POSITION_CLASS.BOTTOM)
		}

		if (!rightOffset) {
			classNames.push(POSITION_CLASS.LEFT)
		}

		return classNames
	}

	useEffect(() => {
		const _positionClass = getPositionClass(calendarArea.getBoundingClientRect())

		setPositionClass(_positionClass)

		setIsShow(true)
	}, [])

	const [isShow, setIsShow] = useState(false)

	useEffect(() => {
		setIsShow(true)
	}, [positionClass])

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
			<div className={cx('layer', { hide: !isShow }, positionClass)} onClick={clickHandler}>
				<div className={cx('inner')} style={{ width, backgroundColor: backgroundColor }}>
					{children}
				</div>
			</div>
		</div>
	)
}

export default CalendarItemPopup
