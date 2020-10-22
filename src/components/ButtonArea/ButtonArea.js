import React, { useState, useEffect } from 'react'
import styles from './ButtonArea.module.scss'
import classNames from 'classnames/bind'

import { ReactComponent as IconPrev } from '../../assets/images/svg/arrow_prev.svg'
import { ReactComponent as IconNext } from '../../assets/images/svg/arrow_next.svg'

const cx = classNames.bind(styles)

const ButtonArea = ({data, getThis, getChange}) => {
	return (
		<>
      <div className={cx('menu')}>
				<button type="button" className={cx('btn', 'today')} onClick={() => getThis()}>
					Today
				</button>
				<button type="button" className={cx('btn', 'prev')} onClick={() => getChange(false)}>
					<IconPrev width="14" height="14" />
				</button>
				<button type="button" className={cx('btn', 'next')} onClick={() => getChange(true)}>
					<IconNext width="14" height="14" />
				</button>
			</div>
		</>
	)
}

export default ButtonArea
