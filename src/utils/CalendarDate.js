import moment from 'moment'

class CalendarDate {
	CURRENT_DATE = null
	YEAR = null
	MONTH = null
	DATE = null

	constructor(initialDate = new Date()) {
		this.CURRENT_DATE = moment(initialDate)

		this.setDateInfo()
	}

	static calcWeekCount({ year, month }) {
		const monthInfo = CalendarDate.getMonthInfo({ year, month })

		console.log(year, month)

		let weekCount = Math.ceil((monthInfo.lastDate + monthInfo.firstDayOfWeek) / 7)

		return weekCount
	}

	static calcScheduleDay({ startAt, endAt }) {
		const startToEnd = moment(endAt).unix() - moment(startAt).unix()

		return Math.floor(startToEnd / 86400 + 1)
	}

	static getDateString(date) {
		return moment(date).format('YYYY-MM-DD')
	}

	static getDateTimeString(date) {
		return moment(date).format('HH:MM:SS')
	}

	static getDateInfo(date = new Date()) {
		return { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() }
	}

	static getMonthInfo({ year, month }) {
		const startDate = moment({ year, month: month - 1, date: 1 })
		const endDate = moment({ year, month: month - 1 }).endOf('month')

		return { firstDayOfWeek: startDate.day() + 1, lastDayOfWeek: endDate.day() + 1, lastDate: endDate.date() }
	}

	getWeekCount() {
		const monthInfo = CalendarDate.getMonthInfo({ year: this.YEAR, month: this.MONTH })

		const WEEK_COUNT = Math.ceil((monthInfo.lastDate + monthInfo.firstDayOfWeek) / 7)

		return WEEK_COUNT
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
