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

const reducer = (state, actions) => {
	const calendar = actions.calendar
	const scheduleList = state.scheduleList || []
	console.log(actions)
	switch (actions.type) {
		case ACTIONS.CREATE:
			return {
				...state,
				scheduleList: [...scheduleList, calendar],
			}
		case ACTIONS.READ:
			return {
				list: [...state],
			}
		case ACTIONS.UPDATE:
			const updatedCalendarList = scheduleList.map((item) =>
				item.calendarId === calendar.calendarId ? calendar : item,
			)

			return {
				...state,
				scheduleList: [...updatedCalendarList],
			}
		case ACTIONS.DELETE:
			const newCalendarList = scheduleList.filter((item) => item.calendarId !== calendar.calendarId)

			return {
				...state,
				scheduleList: newCalendarList,
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

export const readCalendar = () => {
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
