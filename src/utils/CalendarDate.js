import moment from 'moment'

class CalendarDate {
	CURRENT_DATE = null
	YEAR = null
	MONTH = null
	DATE = null

	constructor(initialDate = moment()) {
		this.CURRENT_DATE = initialDate.clone()

		this.setDateInfo()
	}

	/**
	 * 해당 월의 '주' 단위 길이 반환
	 * @param year
	 * @param month
	 * @returns {number}
	 */
	static getWeekLength({ year, month }) {
		const monthInfo = CalendarDate.getMonthInfo({ year, month })

		let weekCount = Math.ceil((monthInfo.lastDate + monthInfo.firstDayOfWeek) / 7)

		return weekCount
	}

	static calcScheduleTimeToUnix({ startAt, endAt }) {
		const startToEnd = moment(endAt).unix() - moment(startAt).unix()

		return Math.floor(startToEnd / 86400 + 1)
	}

	static getDateString(date, format = 'YYYY-MM-DD') {
		return moment(date).format(format)
	}

	static getDateTimeString(date, format = 'HH:mm:ss') {
		return moment(date).format(format)
	}

	static getDateInfo(date = moment()) {
		return { year: date.year(), month: date.month(), date: date.date() }
	}

	getWeekCount() {
		const monthInfo = CalendarDate.getMonthInfo({ year: this.YEAR, month: this.MONTH })

		const WEEK_COUNT = Math.ceil((monthInfo.lastDate + monthInfo.firstDayOfWeek) / 7)

		return WEEK_COUNT
	}

	static getMonthInfo({ year, month }) {
		const startDate = moment({ year, month: month - 1, date: 1 })
		const endDate = moment({ year, month: month - 1 }).endOf('month')

		return { firstDayOfWeek: startDate.day() + 1, lastDayOfWeek: endDate.day() + 1, lastDate: endDate.date() }
	}

	/**
	 * 해당 월의 DateInfo 리스트 반환
	 * @param year
	 * @param month
	 */
	static getMonthInfoList({ year, month }) {
		const currentMonthInfo = CalendarDate.getMonthInfo({ year, month })
		const weekLength = CalendarDate.getWeekLength({ year, month })

		const monthInfoList = new Array(weekLength).fill(null).map((_) => [])

		for (let week = 0; week < weekLength; week++) {
			for (let day = 0; day < 7; day++) {
				const date = 1 - currentMonthInfo.firstDayOfWeek + day + week * 7
				const dateTime = moment([year, month - 1, 1]).add(date, 'days')

				const dateInfo = {
					dateTime,
					isHoliday: day === 0,
					scheduleList: Array(0),
					stack: 0,
				}

				monthInfoList[week].push(dateInfo)
			}
		}

		return [...monthInfoList]
	}

	/**
	 * 해당 월의 '토요일' 리스트 반환
	 * @param year
	 * @param month
	 * @returns {[]}
	 */
	static getSaturdaysOfMonth({ year, month }) {
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

	setDateInfo() {
		this.YEAR = parseInt(this.CURRENT_DATE.format('YYYY'))
		this.MONTH = parseInt(this.CURRENT_DATE.format('MM'))
		this.DATE = parseInt(this.CURRENT_DATE.format('DD'))
	}

	setNextMonth() {
		this.CURRENT_DATE.add(1, 'months')
		this.setDateInfo()
	}

	setPrevMonth() {
		this.CURRENT_DATE.subtract(1, 'months')
		this.setDateInfo()
	}
}

export default CalendarDate
