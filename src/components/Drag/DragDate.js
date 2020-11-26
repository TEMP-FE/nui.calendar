import React, { useEffect, useState } from 'react'
import { startDrag, updateDrag, drop, resetDrag } from '../../reducers/dragDate'
import { moveScheduleDrag, dropSchedule, updateScheduleDrag, resetScheduleDrag } from '../../reducers/dragSchedule'
import { useDragDateContext, useDragScheduleContext } from '../../contexts/calendar'
const DragDate = ({ className, onClick, date, children }) => {
	const [dragImg, setDragImg] = useState();
	const [dragEnter, setDragEnter] = useState(false);
	const { dragDateStore, dragDateDispatch } = useDragDateContext()
	const { dragScheduleStore, dragScheduleDispatch } = useDragScheduleContext()
	useEffect(() => {
		// TODO 타입별로 다르게 구현
		const img = new Image()
		img.src = 'https://avatars1.githubusercontent.com/u/19828721?s=96&v=4'
		img.onload = () => setDragImg(img)
	}, [])

	const handleDragStart = (e) => {
		e.dataTransfer.setDragImage(dragImg, -10, -10)
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
		e.stopPropagation();
		e.preventDefault();
	}

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
		>
			{children}
		</div>
	)
}

export default DragDate
