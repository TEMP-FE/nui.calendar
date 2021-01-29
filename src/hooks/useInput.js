import { useState } from 'react'

const useInput = ({ initialValue, handleChange }) => {
	const [state, setState] = useState(initialValue)

	const onChange = (e) => {
		e.preventDefault()

		let { value } = e.target

		if (handleChange) {
			value = handleChange(e)
		}

		setState(value)
	}

	return [state, onChange]
}

export default useInput
