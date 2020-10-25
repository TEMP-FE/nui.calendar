import { useReducer } from 'react'

/**
 * Ducks Patterns
 *
 * ref: // Ducks Patters *ref: http://guswnsxodlf.github.io/redux-ducks-pattern
 */
const ACTIONS = {
	CREATE: 'nui.calendar/calendar/CREATE',
	READ: 'nui.calendar/calendar/READ',
	UPDATE: 'nui.calendar/calendar/UPDATE',
	DELETE: 'nui.calendar/calendar/DELETE',
}

const reducer = ({ state = { list: [] }, actions = { type: '', calendar: {} } }) => {
	const calendar = actions.calendar
	const { startAt } = calendar
	const calendarList = state[startAt]

	switch (actions.type) {
		case ACTIONS.CREATE:
			return {
				...state,
				[startAt]: [...calendarList, calendar],
			}
		case ACTIONS.READ:
			return {
				list: [...state],
			}
		case ACTIONS.UPDATE:
			const newCalendar = calendarList.find((item) => item.id === calendar.id)

			return {
				...state,
				[startAt]: [...calendarList, newCalendar],
			}
		case ACTIONS.DELETE:
			const newCalendarList = calendarList.filter((item) => item.id !== calendar.id)

			return {
				...state,
				[startAt]: newCalendarList,
			}
		default:
			return state
	}
}

export const createCalendar = (calendar) => {
	return {
		type: ACTIONS.CREATE,
		calendar,
	}
}

export const removeCalendar = () => {
	return {
		type: ACTIONS.READ,
	}
}

export const updateCalendar = (calendar) => {
	return {
		type: ACTIONS.UPDATE,
		calendar,
	}
}

export const deleteCalendar = (calendar) => {
	return {
		type: ACTIONS.DELETE,
		calendar,
	}
}

export default reducer
