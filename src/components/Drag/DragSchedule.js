import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import dragStyle from './Drag.scss'
import { getCategoryColor } from '../CalendarItem/commonState'
import { startDrag, resetScheduleDrag, startResize } from '../../reducers/dragSchedule'
import { useDragScheduleContext } from '../../contexts/drag'
import { calendarType } from '../../const/drag'

const DragSchedule = ({ className, onClick, isBlocked, style, startAt, endAt, index, isLast, children, isTimeType, category, title }) => {
	const [dragImg, setDragImg] = useState()
	const { dragScheduleDispatch, dragScheduleStore } = useDragScheduleContext()
	useEffect(() => {
		// TODO 타입별로 다르게 구현
		setDragImg(new Image())
	}, [])

	const handleDragStart = (e) => {
		if (dragScheduleStore.calendarType === calendarType.MONTH) {
			if (isTimeType) {
				e.dataTransfer.setDragImage(e.currentTarget, 60, 13);
			}
			else {
				let ghost = document.createElement("div")
				ghost.setAttribute('id', 'dragging_ghost')
				ghost.setAttribute('style', `position:absolute; top:0;left:0;width:120px;height:26px;border-radius:4px;z-index:-1;background-color:${getCategoryColor(category)}`)
				ghost.textContent = title
				e.currentTarget.appendChild(ghost)
				e.dataTransfer.setDragImage(ghost, 60, 13)
			}
		}
		else {
			e.dataTransfer.setDragImage(dragImg, 0, 0)
		}
		dragScheduleDispatch(startDrag(index, startAt, endAt))
	}
	const handleDragEnd = (e) => {
		if (!isTimeType && dragScheduleStore.calendarType === calendarType.MONTH) {
			let ghost = document.getElementById('dragging_ghost')
			e.currentTarget.removeChild(ghost)
		}
		dragScheduleDispatch(resetScheduleDrag())
	}
	const handleResizeDragStart = (e) => {
		e.dataTransfer.setDragImage(dragImg, 0, 0)
		dragScheduleDispatch(startDrag(index, startAt, endAt))
		dragScheduleDispatch(startResize())
	}

	return (
		<div className={className} style={{ ...style, pointerEvents: dragScheduleStore.isDragging && index !== dragScheduleStore.dragInfo.index && 'none' }}>
			<div
				style={{ height: '100%', width: '100%' }}
				onClick={onClick}
				draggable={!isBlocked}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				{children}
			</div>
			{isLast && <span
				className={cx(dragScheduleStore.calendarType === calendarType.MONTH ?
					'col_resize' : 'row_resize')}
				draggable={!isBlocked}
				onDragStart={handleResizeDragStart}
			/>}
		</div>
	)
}

export default DragSchedule
