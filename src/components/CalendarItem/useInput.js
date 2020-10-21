import React, { useState } from 'react'

const useInput = ({ initialValue = '', handleChange = () => {} }) => {
	const [state, setState] = useState(initialValue)

	const onChange = (e) => {
		e.preventDefault()

		handleChange()

		setState(e.target.value)
	}

	return [state, setState, onChange]
}

export default useInput
