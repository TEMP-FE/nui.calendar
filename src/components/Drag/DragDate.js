import React, { useEffect, useState } from 'react'
import { startDrag, updateDrag, drop, resetDrag } from '../../reducers/dragDate'
import { moveScheduleDrag, dropSchedule, updateScheduleDrag, resetScheduleDrag } from '../../reducers/dragSchedule'
import { useDragDateContext, useDragScheduleContext } from '../../contexts/drag'
import { calendarType } from '../../const/drag'
const DragDate = ({ className, openPopup, date, children }) => {
	const img = new Image()
	const [dragEnter, setDragEnter] = useState(false);
	const { dragDateStore, dragDateDispatch } = useDragDateContext()
	const { dragScheduleStore, dragScheduleDispatch } = useDragScheduleContext()

	const handleDragStart = (e) => {
		e.dataTransfer.setDragImage(img, 0, 0)
		setDragEnter(true)
		dragDateDispatch(startDrag(date))
	}

	const handleDragEnter = (e) => {
		if (dragScheduleStore.isResizing) {
			if (dragScheduleStore.calendarType !== calendarType.MONTH) {
				date.add(30, 'm')
			}
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
			const { firstPoint, secondPoint } = dragDateStore.dragInfo
			firstPoint.isSameOrBefore(secondPoint) ?
				openPopup(firstPoint.toDate(), secondPoint.add(30, 'm').toDate()) :
				openPopup(secondPoint.toDate(), firstPoint.add(30, 'm').toDate())

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

	const handleClick = () => {
		const tempEndAt = date.clone().add(30, 'm')
		openPopup(date.toDate(), tempEndAt.toDate())
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
			onClick={handleClick}
			style={{ backgroundColor: isScheduleMovingIn && 'rgba(255,0,0,0.1)' }}
		>
			{children}
		</div>
	)
}

export default DragDate
