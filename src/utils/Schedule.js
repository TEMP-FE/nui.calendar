import moment from 'moment'

import { CATEGORY_NAME } from '../constants/defaultCategory'

class Schedule {
	scheduleId = 0
	title = ''
	startAt = null
	endAt = null
	category = ''
	isAllDay = false
	isBlocked = false
	index = 0

	/**
	 *
	 * @param {number} scheduleId
	 * @param {string} title
	 * @param {moment.Moment} startAt
	 * @param {moment.Moment} endAt
	 * @param {string} category
	 * @param {boolean} isAllDay
	 * @param {boolean} isBlocked
	 */
	constructor({
		title = '일정',
		startAt = moment(),
		endAt = moment(),
		category = CATEGORY_NAME.PERSONAL,
		isAllDay = true,
		isBlocked = false,
	}) {
		this.scheduleId = Math.random()
		this.title = title
		this.startAt = startAt
		this.endAt = endAt
		this.category = category
		this.isAllDay = isAllDay
		this.isBlocked = isBlocked
	}

	setIndex(index) {
		this.index = index
	}

	update({ title = null, startAt = null, endAt = null, category = null, isAllDay = null, isBlocked = null }) {
		this.title = title === null ? this.title : title
		this.startAt = startAt === null ? this.startAt : startAt
		this.endAt = endAt === null ? this.endAt : endAt
		this.category = category === null ? this.category : category
		this.isAllDay = isAllDay === null ? this.isAllDay : isAllDay
		this.isBlocked = isBlocked === null ? this.isBlocked : isBlocked
	}

	isAllDay() {
		const startAtValue = this.startAt.valueOf()
		const endAtValue = this.endAt.valueOf()

		return endAtValue - startAtValue > 86400000
	}

	isIncluded(dateTime) {
		const scheduleStart = this.startAt
		const scheduleEnd = this.endAt

		return dateTime.isSameOrAfter(scheduleStart) && dateTime.isSameOrBefore(scheduleEnd) ? true : false
	}
}

export default Schedule
