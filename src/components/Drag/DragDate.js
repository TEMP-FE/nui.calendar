import React, { useEffect, useState } from 'react'
import { startDrag, updateDrag, drop, resetDrag } from '../../reducers/dragDate'
import { moveScheduleDrag, dropSchedule, updateScheduleDrag, resetScheduleDrag } from '../../reducers/dragSchedule'
import { useDragDateContext, useDragScheduleContext } from '../../contexts/drag'
import { calendarType } from '../../const/drag'
const DragDate = ({ className, openPopup, date, children }) => {
	const img = new Image()
	const [dragScheduleEnter, setDragScheduleEnter] = useState(false);
	const { dragDateStore, dragDateDispatch } = useDragDateContext()
	const { dragScheduleStore, dragScheduleDispatch } = useDragScheduleContext()

	const handleDragStart = (e) => {
		e.dataTransfer.setDragImage(img, 0, 0)
		setDragScheduleEnter(true)
		dragDateDispatch(startDrag(date))
	}

	const handleDragEnter = (e) => {
		const cloneDate = date.clone()
		if (dragScheduleStore.isResizing) {
			if (dragScheduleStore.calendarType !== calendarType.MONTH) {
				cloneDate.add(30, 'm')
			}
			dragScheduleDispatch(updateScheduleDrag(cloneDate))
		}
		else if (dragScheduleStore.isDragging) {
			dragScheduleDispatch(moveScheduleDrag(cloneDate))
		}
		else if (!dragScheduleEnter) {
			dragDateDispatch(updateDrag(cloneDate))
		}
		setDragScheduleEnter(true)
	}

	const handleDragLeave = (e) => {
		setDragScheduleEnter(false)
	}

	const handleDrop = (e) => {
		if (dragScheduleStore.isResizing) {
			dragScheduleDispatch(resetScheduleDrag())
		}
		else if (dragScheduleStore.isDragging) {
			dragScheduleDispatch(dropSchedule())
		}
		else {
			const { firstPoint, secondPoint } = dragDateStore.dragInfo
			firstPoint.isSameOrBefore(secondPoint) ?
				openPopup(firstPoint, secondPoint.add(30, 'm')) :
				openPopup(secondPoint, firstPoint.add(30, 'm'));

			dragDateDispatch(drop())
		}
		setDragScheduleEnter(false)
	}

	const handleDragEnd = () => {
		dragDateDispatch(resetDrag())
	}

	const handleDragOver = (e) => {
		e.stopPropagation()
		e.preventDefault()
	}

	const handleClick = () => {
		const tempEndAt = date.clone().add(30, 'm')
		openPopup(date, tempEndAt)
	}

	const isScheduleMovingIn = dragScheduleStore.calendarType === calendarType.MONTH && dragScheduleEnter && !dragScheduleStore.isResizing && dragScheduleStore.isDragging

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
			onClick={handleClick}
			style={{ backgroundColor: isScheduleMovingIn && 'rgba(255,0,0,0.1)' }}
		>
			{children}
		</div>
	)
}

export default DragDate
