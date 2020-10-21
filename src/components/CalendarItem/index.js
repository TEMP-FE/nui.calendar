import React, { useState } from 'react'
import CalendarItem from './CalendarItem'
import CalendarItemPopupEditor from './CalendarItemPopupEditor'

const Index = (item) => {
	const [isEdit, setIsEdit] = useState(false)

	const handleEdit = () => {
		setIsEdit(true)
	}

	const handleDelete = () => {}

	const handleClose = () => {
		setIsEdit(false)
	}

	return (
		<>
			<CalendarItem handleEdit={handleEdit} handleDelete={handleDelete} {...item} />
			<CalendarItemPopupEditor id={'wa-popup'} isShown={isEdit} handleClose={handleClose} {...item} />
		</>
	)
}

export default Index
