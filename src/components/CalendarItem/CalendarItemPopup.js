import React from 'react'

import classNames from 'classnames/bind'

import styles from './CalendarItemPopup.module.scss'

const cx = classNames.bind(styles)

const CalendarItemPopup = ({ id, width, backgroundColor, isShown, children }) => {
	// TODO: 레이어 상하좌우 위치 조정 Func...
	return (
		<div id={id} className={cx('component', { 'is-show': isShown })} role="dialog">
			<div className={cx('inner')} style={{ width, backgroundColor: backgroundColor }}>
				{children}
			</div>
		</div>
	)
}

export default CalendarItemPopup
