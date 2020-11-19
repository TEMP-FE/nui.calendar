import { useState } from 'react'

const useInput = ({ initialValue = '', handleChange }) => {
	const [state, setState] = useState(initialValue)

	const onChange = (e) => {
		e.preventDefault()

		if (handleChange) {
			const handleResult = handleChange(e)

			setState(handleResult)
		} else {
			setState(e.target.value)
		}
	}

	return [state, onChange]
}

export default useInput
