import React, { useEffect, useState } from 'react'

import CalendarItem from './CalendarItem'
import CalendarItemPopupInfo from './CalendarItemPopupInfo'

const CalendarItemWithPopup = ({ id, ...item }) => {
	const [isPopupShown, setIsPopupShown] = useState(false)

	const handleIsPopupShown = () => {
		setIsPopupShown(!isPopupShown)

		console.log('test')
	}

	useEffect(() => {
		console.log(isPopupShown)
	}, [isPopupShown])

	return (
		<>
			<CalendarItem handleIsShown={handleIsPopupShown} {...item} />
			{isPopupShown && <CalendarItemPopupInfo id={id} handleClose={handleIsPopupShown} {...item} />}
		</>
	)
}

export default CalendarItemWithPopup
