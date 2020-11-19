import React, { useState } from 'react'

import CalendarItem from './CalendarItem'
import CalendarItemPopupEditor from './CalendarItemPopupEditor'
import CalendarItemPopupInfo from './CalendarItemPopupInfo'

const Index = (item) => {
	const [isInfoShown, setIsInfoShown] = useState(false)
	const [isEditShown, setIsEditShown] = useState(false)

	const handleEditShown = () => {
		setIsEditShown(!isEditShown)
	}

	const handleInfoShown = () => {
		setIsInfoShown(!isInfoShown)
	}

	const handleEdit = () => {
		handleInfoShown()
		handleEditShown()
	}

	return (
		<>
			<CalendarItem
				id={`wa-popup-${item.calendarId}`}
				isShown={setIsInfoShown}
				handleIsShown={handleInfoShown}
				{...item}
			/>
			{isEditShown && (
				<CalendarItemPopupEditor id={`wa-popup-${item.calendarId}`} handleClose={handleEditShown} {...item} />
			)}
			{isInfoShown && (
				<CalendarItemPopupInfo
					id={`wa-popup-${item.calendarId}`}
					isShown={isInfoShown}
					handleEdit={handleEdit}
					handleClose={handleInfoShown}
					{...item}
				/>
			)}
		</>
	)
}

export default Index
