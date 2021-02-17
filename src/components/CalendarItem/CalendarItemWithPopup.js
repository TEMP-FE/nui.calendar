import React, { useState } from 'react'

import CalendarItem from './CalendarItem'
import CalendarItemPopupInfo from './CalendarItemPopupInfo'

const CalendarItemWithPopup = ({ id, style, schedule, isLast, ...props }) => {
	const [isPopupShown, setIsPopupShown] = useState(false)

	const handleIsPopupShown = () => {
		setIsPopupShown(!isPopupShown)
	}

	return (
		<>
			<CalendarItem style={style} schedule={schedule} isLast={isLast} handleIsShown={handleIsPopupShown} />
			{isPopupShown && (
				<CalendarItemPopupInfo
					id={id}
					handleClose={handleIsPopupShown}
					style={style}
					schedule={schedule}
					isLast={isLast}
				/>
			)}
		</>
	)
}

export default CalendarItemWithPopup
