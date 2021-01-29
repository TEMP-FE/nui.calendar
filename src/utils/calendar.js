import moment from 'moment'

// dateTime 이 scheduleItem 에 포함되어있는지 판단하는 함수
export const getSaturdaysOfMonth = ({ year, month }) => {
	let firstSaturday = moment({ year, month })

	if (firstSaturday.date() > 7) {
		firstSaturday.add(7, 'd')
	}

	let saturdayList = []
	let currentMonth = firstSaturday.month()

	while (currentMonth === firstSaturday.month()) {
		saturdayList.push(firstSaturday.clone())
		firstSaturday.add(7, 'd')
	}

	return saturdayList
}

export const isDateTimeIncludeScheduleItem = (dateTime, scheduleItem) => {
	const scheduleStart = scheduleItem.startAt
	const scheduleEnd = scheduleItem.endAt

	return dateTime.isSameOrAfter(scheduleStart) && dateTime.isSameOrBefore(scheduleEnd) ? true : false
}
