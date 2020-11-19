import React, { useEffect, useState } from 'react'

const DragSchedule = ({ setDragSchedule, resetDragSchedule, isBlocked, children }) => {
	const [dragImg, setDragImg] = useState();
	useEffect(() => {
		// TODO 타입별로 다르게 구현
		const img = new Image()
		img.src = 'https://avatars1.githubusercontent.com/u/19828721?s=96&v=4'
		img.onload = () => setDragImg(img)
	}, [])

	const handleDragStart = (e) => {
		e.dataTransfer.setDragImage(dragImg, -10, -10)
		setDragSchedule()
	}
	const handleDragEnd = (e) => {
		resetDragSchedule()
	}

	const handleDragOver = (e) => {
		e.preventDefault()
	}

	return (
		<div
			draggable={!isBlocked}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			{children}
		</div>
	)
}

export default DragSchedule
