/**
 * Ducks Patterns
 *
 * ref: // Ducks Patters *ref: http://guswnsxodlf.github.io/redux-ducks-pattern
 */

const ACTIONS = {
	CREATE: 'nui.calendar/schedule/CREATE',
	READ: 'nui.calendar/schedule/READ',
	UPDATE: 'nui.calendar/schedule/UPDATE',
	DELETE: 'nui.calendar/schedule/DELETE',
}

const reducer = (state, actions) => {
	const { schedule } = actions
	const scheduleList = state.scheduleList || []

	switch (actions.type) {
		case ACTIONS.CREATE:
			return {
				...state,
				scheduleList: [...scheduleList, schedule],
			}
		case ACTIONS.READ:
			return {
				list: [...state],
			}
		case ACTIONS.UPDATE:
			const updatedCalendarList = scheduleList.map((item) => {
				if (item.scheduleId === schedule.scheduleId) {
					item.update(schedule)
				}

				return item
			})

			return {
				...state,
				scheduleList: [...updatedCalendarList],
			}
		case ACTIONS.DELETE:
			const newScheduleList = scheduleList.filter((item) => item.scheduleId !== schedule.scheduleId)

			return {
				...state,
				scheduleList: newScheduleList,
			}
		default:
			return state
	}
}

export const createCalendar = (schedule) => {
	return {
		type: ACTIONS.CREATE,
		schedule,
	}
}

export const readCalendar = () => {
	return {
		type: ACTIONS.READ,
	}
}

export const updateCalendar = (schedule) => {
	return {
		type: ACTIONS.UPDATE,
		schedule,
	}
}

export const deleteCalendar = (scheduleId) => {
	return {
		type: ACTIONS.DELETE,
		schedule: { scheduleId },
	}
}

export default reducer
