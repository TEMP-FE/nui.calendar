import { calendarType, scheduleInitialState } from '../const/drag';
/**
 * Ducks Patterns
 *
 * ref: // Ducks Patters *ref: http://guswnsxodlf.github.io/redux-ducks-pattern
 */
const ACTIONS = {
	CALENDAR: 'nui.calendar/drag/calendar',
	START: 'nui.calendar/drag/start',
	RESIZE: 'nui.calendar/drag/resize',
	MOVE: 'nui.calendar/drag/move',
	UPDATE: 'nui.calendar/drag/update',
	RESET: 'nui.calendar/drag/reset',
	DROP: 'nui.calendar/drag/drop',
}

const reducer = (state, actions) => {
	const diffUnit = (state.calendarType && state.calendarType === calendarType.MONTH) ? 'days' : 'minutes'
	switch (actions.type) {
		case ACTIONS.CALENDAR:
			return {
				...state,
				calendarType: actions.calendarType,
			}
		case ACTIONS.RESIZE:
			return {
				...state,
				isResizing: true,
			}
		case ACTIONS.START:
			return {
				...state,
				isDragging: true,
				dragInfo: {
					index: actions.index,
					startAt: actions.startAt,
					endAt: actions.endAt,
					diff: actions.endAt.diff(actions.startAt, diffUnit)
				},
			}
		case ACTIONS.MOVE:
			const start = actions.date
			const end = start.clone().add(state.dragInfo.diff, diffUnit)
			return {
				...state,
				dragInfo: {
					...state.dragInfo,
					startAt: start,
					endAt: end
				}
			}
		case ACTIONS.UPDATE:
			if (actions.date.isSameOrBefore(state.dragInfo.startAt)) {
				return state
			}
			return {
				...state,
				dragInfo: {
					...state.dragInfo,
					endAt: actions.date,
					diff: actions.date.diff(actions.startAt, diffUnit)
				},
			}
		case ACTIONS.RESET:
			return {
				...scheduleInitialState,
				calendarType: state.calendarType
			};
		case ACTIONS.DROP:
			return {
				...state,
				isDragging: false,
				isDropped: true
			};
		default:
			return state
	}
}

export const setCalendar = (calendarType) => {
	return {
		type: ACTIONS.CALENDAR,
		calendarType
	}
}

export const startDrag = (index, startAt, endAt) => {
	return {
		type: ACTIONS.START,
		index,
		startAt,
		endAt
	}
}

export const startResize = () => {
	return {
		type: ACTIONS.RESIZE,
	}
}

export const resetScheduleDrag = () => {
	return {
		type: ACTIONS.RESET,
	}
}

export const dropSchedule = () => {
	return {
		type: ACTIONS.DROP,
	}
}

export const moveScheduleDrag = (date) => {
	return {
		type: ACTIONS.MOVE,
		date
	}
}

export const updateScheduleDrag = (date) => {
	return {
		type: ACTIONS.UPDATE,
		date
	}
}

export default reducer
