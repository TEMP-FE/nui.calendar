import React, { useState } from 'react'

import CalendarItem from './CalendarItem'
import CalendarItemPopupEditor from './CalendarItemPopupEditor'

const Index = (item) => {
	const [isEditShown, setIsEditShwon] = useState(false)

	const handleEdit = () => {
		setIsEditShwon(true)
	}

	const handleClose = () => {
		setIsEditShwon(false)
	}

	return (
		<>
			<CalendarItem handleEdit={handleEdit} {...item} />
			{isEditShown && <CalendarItemPopupEditor id={'wa-popup'} handleClose={handleClose} {...item} />}
		</>
	)
}

export default Index
