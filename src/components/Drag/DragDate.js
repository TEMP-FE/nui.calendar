import React, { useEffect, useState } from 'react'
import { dragType } from '../../const/dragType'

const DragDate = ({
	setDragDateStart,
	setDragDateEnter,
	setDragDateDrop,
	setDragScheduleDrop,
	resetDragDate,
	type,
	scheduleEnterStyle,
	children,
}) => {
	const [dragImg, setDragImg] = useState()
	const [scheduleEnter, setScheduleEnter] = useState()
	useEffect(() => {
		// TODO 타입별로 다르게 구현
		const img = new Image()
		img.src = 'https://avatars1.githubusercontent.com/u/19828721?s=96&v=4'
		img.onload = () => setDragImg(img)
	}, [])

	const handleDragStart = (e) => {
		e.dataTransfer.setDragImage(dragImg, -10, -10)
		setDragDateStart()
	}

	const handleDragEnter = (e) => {
		if (type === dragType.DATE) {
			setDragDateEnter()
		} else if (type === dragType.SCHEDULE) {
			setScheduleEnter(true)
		}
	}

	const handleDragLeave = (e) => {
		if (type === dragType.SCHEDULE) {
			setScheduleEnter(false)
		}
	}

	const handleDrop = (e) => {
		e.preventDefault()
		if (type === dragType.DATE) {
			setDragDateDrop()
		} else if (type === dragType.SCHEDULE) {
			setDragScheduleDrop()
			setScheduleEnter(false)
		}
	}

	const handleDragEnd = () => {
		if (type === dragType.DATE) {
			resetDragDate()
		}
	}

	const handleDragOver = (e) => {
		e.stopPropagation()
		e.preventDefault()
	}

	const style = Object.assign(
		{ position: 'relative', width: '100%', height: '100%' },
		scheduleEnter && scheduleEnterStyle,
	)

	return (
		<div
			draggable
			onDragStart={handleDragStart}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onDragEnd={handleDragEnd}
			style={style}
		>
			{children}
		</div>
	)
}

export default DragDate
