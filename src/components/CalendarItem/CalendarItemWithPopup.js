import React, { useState } from 'react'

import CalendarItem from './CalendarItem'
import CalendarItemPopupInfo from './CalendarItemPopupInfo'

const CalendarItemWithPopup = ({ id, ...item }) => {
	const [isPopupShown, setIsPopupShown] = useState(false)

	const handleIsPopupShown = () => {
		setIsPopupShown(!isPopupShown)
	}

	return (
		<>
			<CalendarItem handleIsShown={handleIsPopupShown} {...item} />
			{isPopupShown && <CalendarItemPopupInfo id={id} handleClose={handleIsPopupShown} {...item} />}
		</>
	)
}

export default CalendarItemWithPopup
