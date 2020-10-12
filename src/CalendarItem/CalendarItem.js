import React, { useState } from 'react'
import {ReactComponent as IconRepeat} from './icon-repeat.svg'
import {ReactComponent as IconLocation} from './icon-location.svg'
import {ReactComponent as IconBlock} from './icon-block.svg'
import {ReactComponent as IconLock} from './icon-lock.svg'
import {ReactComponent as IconPerson} from './icon-person.svg'

import classNames from 'classnames/bind'

import styles from './CalendarItem.module.scss'

const cx = classNames.bind(styles)

const DEMO_ITEM_A = {
    title: '캘린더 내 일정 항목 컴포넌트 만들기 캘린더 내 일정 항목 컴포넌트 만들기',
    location: '',
    range: '',
    group: 'A',
    startAt: '06:30',
    endAt: '10:30',
    isAllDay: false,
    isBlocked: true
}
const DEMO_ITEM_B = {
    title: '캘린더 내 일정 항목 컴포넌트 만들기 캘린더 내 일정 항목 컴포넌트 만들기',
    location: '',
    range: '',
    group: 'B',
    startAt: '0630',
    endAt: '1030',
    isAllDay: true,
    isBlocked: false
}

// 일정 그룹 별 색상
const getGroupColor = (group) => {
    switch(group) {
        case 'A':
            return '#009ac7'
        case 'B':
            return '#09b65a'
        case 'C':
            return '#ff5252'
        default:
            return '#fdae2e'
    }
}

// TODO: 더 좋은 방법(?)
const getIcon = ({members, hasLocation, isBlocked, isRepeatable}) => {
    // 반복 일정
    if (isRepeatable) {
        return <IconRepeat width={10} height={10} />
    }

    // 수정 불가 일정
    if (isBlocked) {
        return <IconBlock width={10} height={10} />
    }

    // 위치 지정 일정
    if (hasLocation) {
        return <IconLocation width={10} height={10} />
    }

    // if 개인 일정 else 공개 일정
    if (members === 'private') {
        return <IconLock width={10} height={10} />
    } else {
        return <IconPerson width={10} height={10} />
    }

}

/**
 * 기간(종일) 일정 항목
 * @param item 일정 객체
 * @returns {JSX.Element}
 * @constructor
 */
const DayType = ({...item}) => {
    const [isPopup, setIsPopup] = useState(true)

    const {title, startAt, endAt, location, range, group, isBlocked} = item

    const handlePopup = () => {
        setIsPopup(!isPopup)
    }

    return (
        <div className={cx('component')} draggable={!isBlocked}>
            <button
                type='button'
                className={cx('item', 'type-day')}
                style={{backgroundColor: getGroupColor(group)}}
                aria-haspopup='dialog'
                aria-controls='wa-popup'
                aria-expanded={isPopup}
                onClick={handlePopup}
            >
                <span className='blind'>{group}</span>
                <span className='blind'>
                    <span className={cx('period')}>{startAt}</span>
                    <span className={cx('period')}>{endAt}</span>
                </span>
                <span className={cx('cell', 'type-icon')}>
                    {getIcon(item)}
                </span>
                <span className={cx('cell')}>
                    <span className={cx('fixed')}>
                        <span className={cx('cell', 'ellipsis')}>
                            <span className={cx('title')}>{title}</span>
                        </span>
                    </span>
                </span>
            </button>
            <div
                id='wa-popup'
                className={cx('popup')}
                role='dialog'
                hidden={isPopup}
            >
                <div className={cx('box')} style={{backgroundColor: getGroupColor(group)}}>
                    <div className={cx('inner')}>
                        팝업 테스트
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * 기간(시간) 일정 항목
 * @param item 일정 객체
 * @returns {JSX.Element}
 * @constructor
 */
const TimeType = ({...item}) => {
    const [isPopup, setIsPopup] = useState(true)

    const {title, startAt, endAt, location, range, group, isBlocked} = item

    const handlePopup = () => {
        setIsPopup(!isPopup)
    }

    return (
        <div className={cx('component')} draggable={!isBlocked}>
            <button
                type='button'
                className={cx('item')}
                aria-haspopup='dialog'
                aria-controls='wa-popup'
                aria-expanded={isPopup}
                onClick={handlePopup}
            >
                <span className={cx('cell', 'type-group')}>
                    <span className={cx('group')} style={{backgroundColor: getGroupColor(group)}}>
                        <span className='blind'>{group}</span>
                    </span>
                </span>
                <span className={cx('cell', 'type-period')}>
                    <span className={cx('period')}>{startAt}</span>
                    <span className={cx('period')}>{endAt}</span>
                </span>
                <span className={cx('cell', 'type-icon')}>
                    {getIcon(item)}
                </span>
                <span className={cx('cell')}>
                    <span className={cx('fixed')}>
                        <span className={cx('cell', 'ellipsis')}>
                            <span className={cx('title')}>{title}</span>
                        </span>
                    </span>
                </span>
            </button>
            <div
                id='wa-popup'
                className={cx('popup')}
                role='dialog'
                hidden={isPopup}
            >
                <div className={cx('box')} style={{backgroundColor: getGroupColor(group)}}>
                    <div className={cx('inner')}>
                        팝업 테스트
                    </div>
                </div>
            </div>
        </div>
    )
}

export default (Item) => Item.isAllDay ? <DayType {...Item} /> : <TimeType {...Item} />