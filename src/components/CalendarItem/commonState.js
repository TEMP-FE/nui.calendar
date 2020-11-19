// FIXME: 공통 사용될 함수 임시 분리

export const getCategoryList = () => {
	return ['A', 'B', 'C', 'default']
}

// 일정 그룹 별 색상
export const getCategoryColor = (group) => {
	switch (group) {
		case 'A':
			return '#009ac7'
		case 'B':
			return '#09b65a'
		case 'C':
			return '#ff5252'
		default:
			return '#fdae2e'
	}
}
