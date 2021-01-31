import { useState } from 'react'

/**
 *
 * @param initialValue 초기값
 * @param valueFilter 입력 값의 정제가 필요한 경우 필터링 함수
 * @param handleChange 부모 컴포넌트로 값을 전달하기 위한 전달자 함수
 * @returns {[unknown, onChange]}
 */
const useInput = ({ initialValue, valueFilter, handleChange }) => {
	const [state, setState] = useState(initialValue)

	const onChange = (e) => {
		e.preventDefault()

		let { value } = e.target

		if (valueFilter) {
			value = valueFilter(value)
		}

		setState(value)

		handleChange(value)
	}

	return [state, onChange]
}

export default useInput
