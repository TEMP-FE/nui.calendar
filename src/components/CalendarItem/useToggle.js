import React, { useState } from 'react'

const useToggle = ({ initialValue = false, handleChange = () => {} }) => {
	const [state, setState] = useState(initialValue)

	const onChange = (e) => {
		e.preventDefault()

		handleChange()

		setState(!state)
	}

	return [state, setState, onChange]
}

export default useToggle
