import { padStart } from './common'
import moment from 'moment'

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
export const getDateInfo = (date = moment()) => {
	return { year: +date.format('YYYY'), month: +date.format('MM') - 1, date: +date.format('DD') }
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
	return moment(schedule.endAt).diff(schedule.startAt, 'd') + 1
}

// DateTime 객체 -> YYYY-MM-DD string 형태로 변환
export const parseDateToString = (dateTime) => moment(dateTime).format('YYYY-MM-DD')
export const parseDateToTimeString = (dateTime) => moment(dateTime).format('HH:MM:SS')

// dateTime 이 scheduleItem 에 포함되어있는지 판단하는 함수
export const getSaturdaysOfMonth = (year, month) => {
	let saturdayList = []
	let saturday = moment().year(year).month(month).startOf('month').day('Saturday')
	if (saturday.date() > 7) saturday.add(7, 'd')
	let currentMonth = saturday.month()
	while (currentMonth === saturday.month()) {
		saturdayList.push(saturday.clone())
		saturday.add(7, 'd')
	}
	return saturdayList
}

export const isDateTimeIncludeScheduleItem = (dateTime, scheduleItem) => {
	const startDiff = moment(dateTime).diff(scheduleItem.startAt, 'd')
	const endDiff = moment(dateTime).diff(scheduleItem.endAt, 'd')
	return startDiff >= 0 && endDiff <= 0 ? true : false
}
