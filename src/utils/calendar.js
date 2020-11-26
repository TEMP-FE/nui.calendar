import { padStart } from './common'

export const dayOfWeekList = [
	{
		lang: 'en',
		data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	},
	{
		lang: 'ko',
		data: ['일', '월', '화', '수', '목', '금', '토'],
	},
]

// 초기 Date 객체
export const getDateInfo = (date = new Date()) => {
	return { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }
}

export const getMonthInfo = ({ year, month }) => {
	const firstDay = new Date(year, month - 1, 1)
	const lastDay = new Date(year, month, 0)
	const firstDayOfWeek = firstDay.getDay()
	const lastDayOfWeek = lastDay.getDay()
	const lastDate = lastDay.getDate()

	return {
		firstDayOfWeek,
		lastDayOfWeek,
		lastDate,
	}
}

export const calcWeekCount = ({ year, month }) => {
	const monthInfo = getMonthInfo({ year, month })
	let weekCount = Math.ceil((monthInfo.lastDate + monthInfo.firstDayOfWeek) / 7)

	return weekCount
}

export const isSameDate = (date1, date2) => {
	const date1Info = getDateInfo(date1)
	const date2Info = getDateInfo(date2)
	if (date1Info.year === date2Info.year && date1Info.month === date2Info.month && date1Info.date === date2Info.date) {
		return true
	} else {
		return false
	}
}

export const calcScheduleDay = (schedule) => {
	const time = schedule.endAt.getTime() - schedule.startAt.getTime()
	return Math.floor(time / 86400000 + 1)
}

// DateTime 객체 -> YYYY-MM-DD string 형태로 변환
export const parseDateToString = (dateTime) => {
	const { year, month, date } = getDateInfo(dateTime)
	return `${year}-${padStart(month + 1, 2)}-${padStart(date, 2)}`
}

// dateTime 이 scheduleItem 에 포함되어있는지 판단하는 함수
export const isDateTimeIncludeScheduleItem = (dateTime, scheduleItem) => {
	const scheduleStart = scheduleItem.startAt.getTime()
	const scheduleEnd = scheduleItem.endAt.getTime()
	return dateTime.getTime() >= scheduleStart && dateTime.getTime() <= scheduleEnd ? true : false
}
