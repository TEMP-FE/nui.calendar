import React, { useEffect, useState } from 'react'
import { startDrag, resetScheduleDrag, startReisze } from '../../reducers/dragSchedule'
import { useDragScheduleContext } from '../../contexts/calendar'
import { calendarType } from '../../const/drag'

const DragSchedule = ({ className, onClick, isBlocked, style, startAt, endAt, index, isLast, children }) => {
	const [dragImg, setDragImg] = useState();
	const { dragScheduleDispatch, dragScheduleStore } = useDragScheduleContext()
	const monthReiszeStyle = {
		cursor: 'col-resize',
		top: 0,
		right: 0,
		bottom: 0,
	}
	const dayReiszeStyle = {
		cursor: 'row-resize',
		right: 0,
		bottom: 0,
		left: 0,
	}
	const resizeStyle = Object.assign({
		position: 'absolute',
		margin: 'auto',
		width: '15px',
		height: '15px',
		backgroundColor: 'black'
	}, dragScheduleStore.calendarType === calendarType.MONTH ? monthReiszeStyle : dayReiszeStyle)
	useEffect(() => {
		// TODO 타입별로 다르게 구현
		setDragImg(new Image())
	}, [])

	const handleDragStart = (e) => {
		if (!dragScheduleStore.isResizing && dragScheduleStore.calendarType === calendarType.MONTH) {
			document.body.classList.add('monthly_schedule_move')
			e.currentTarget.style.cursor = "move"
		}
		e.dataTransfer.setDragImage(dragImg, 0, 0)
		dragScheduleDispatch(startDrag(index, startAt, endAt))
	}
	const handleDragEnd = (e) => {
		dragScheduleDispatch(resetScheduleDrag())
	}
	const handleResizeDragStart = () => {
		dragScheduleDispatch(startReisze())
	}

	return (
		<div
			className={className}
			onClick={onClick}
			draggable={!isBlocked}
			style={style}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			{children}
			{isLast && <span
				style={resizeStyle}
				draggable={!isBlocked}
				onDragStart={handleResizeDragStart}
			/>}
		</div>
	)
}

export default DragSchedule
