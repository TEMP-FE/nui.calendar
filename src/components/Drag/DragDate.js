import React, { useEffect, useState } from 'react'
import { startDrag, updateDrag, drop, resetDrag } from '../../reducers/dragDate'
import { moveScheduleDrag, dropSchedule, updateScheduleDrag, resetScheduleDrag } from '../../reducers/dragSchedule'
import { useDragDateContext, useDragScheduleContext } from '../../contexts/drag'
import { calendarType } from '../../const/drag'
const DragDate = ({ className, onClick, date, children }) => {
	const [dragEnter, setDragEnter] = useState(false);
	const { dragDateStore, dragDateDispatch } = useDragDateContext()
	const { dragScheduleStore, dragScheduleDispatch } = useDragScheduleContext()

	const handleDragStart = (e) => {
		const img = new Image()
		e.dataTransfer.setDragImage(img, 0, 0)
		setDragEnter(true)
		dragDateDispatch(startDrag(date))
	}

	const handleDragEnter = (e) => {
		if (dragScheduleStore.isResizing) {
			dragScheduleDispatch(updateScheduleDrag(date))
		}
		else if (dragScheduleStore.isDragging) {
			dragScheduleDispatch(moveScheduleDrag(date))
		}
		else if (!dragEnter) {
			dragDateDispatch(updateDrag(date))
		}
		setDragEnter(true)
	}

	const handleDragLeave = (e) => {
		setDragEnter(false)
	}

	const handleDrop = (e) => {
		if (dragScheduleStore.isResizing) {
			dragScheduleDispatch(resetScheduleDrag())
		}
		else if (dragScheduleStore.isDragging) {
			dragScheduleDispatch(dropSchedule())
		}
		else {
			dragDateDispatch(drop())
		}
		setDragEnter(false)
	}

	const handleDragEnd = () => {
		dragDateDispatch(resetDrag())
	}

	const handleDragOver = (e) => {
		e.stopPropagation()
		e.preventDefault()
	}

	const isScheduleMovingIn = dragScheduleStore.calendarType === calendarType.MONTH && dragEnter && !dragScheduleStore.isResizing && dragScheduleStore.isDragging

	return (
		<div
			draggable
			onDragStart={handleDragStart}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onDragEnd={handleDragEnd}
			className={className}
			onClick={onClick}
			style={{ backgroundColor: isScheduleMovingIn && 'rgba(255,0,0,0.1)' }}
		>
			{children}
		</div>
	)
}

export default DragDate
