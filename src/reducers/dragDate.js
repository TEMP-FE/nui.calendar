import { calendarType } from '../const/drag';
/**
 * Ducks Patterns
 *
 * ref: // Ducks Patters *ref: http://guswnsxodlf.github.io/redux-ducks-pattern
 */
const ACTIONS = {
	CALENDAR: 'nui.calendar/drag/calendar',
	START: 'nui.calendar/drag/start',
	UPDATE: 'nui.calendar/drag/update',
	RESET: 'nui.calendar/drag/reset',
	DROP: 'nui.calendar/drag/drop',
}

const reducer = (state, actions) => {
	switch (actions.type) {
		case ACTIONS.CALENDAR:
			return {
				...state,
				calendarType: actions.calendarType,
				saturdayList: actions.saturdayList
			}
		case ACTIONS.START:
			const secondPoint = actions.date.clone()
			if (state.calendarType !== calendarType.MONTH) {
				secondPoint.add(30, 'm')
			}
			return {
				...state,
				isDragging: true,
				dragInfo: {
					...state.dragInfo,
					firstPoint: actions.date,
					secondPoint: secondPoint
				},
				renderList: [{ startAt: actions.date, endAt: secondPoint }]
			}
		case ACTIONS.UPDATE:
			const firstDay = state.dragInfo.firstPoint.isBefore(actions.date) ? state.dragInfo.firstPoint : actions.date
			const lastDay = firstDay.isSame(actions.date) ? state.dragInfo.firstPoint : actions.date
			const saturdayList = state.saturdayList
			let tempRenderList = [];
			if (state.calendarType === calendarType.MONTH) {
				let saturdayForFirst = -1
				const length = saturdayList.length;
				for (let i = 0; i < length; ++i) {
					const prevSunday = i > 0 ? saturdayList[i - 1].clone().add(1, 'd') : undefined
					const saturday = saturdayList[i]
					let fullWeek = true
					if (saturdayForFirst < 0 && firstDay.isSameOrBefore(saturday)) {
						saturdayForFirst = i
						tempRenderList.push({ startAt: firstDay, endAt: saturday })
						fullWeek = false
					}

					if (lastDay.isSameOrBefore(saturday)) {
						if (saturdayForFirst === i) {
							tempRenderList[0].endAt = lastDay
						}
						else {
							tempRenderList.push({ startAt: prevSunday, endAt: lastDay })
						}
						break;
					}
					else if (i > 0 && fullWeek) {
						tempRenderList.push({ startAt: prevSunday, endAt: saturday })
						if (i === length - 1) {
							const lastSunday = saturday.clone().add(1, 'd')
							tempRenderList.push({ startAt: lastSunday, endAt: lastDay })
						}
					}
				}
			}
			else if (state.calendarType === calendarType.WEEK) {
				let start = firstDay.clone()
				const end = lastDay.clone().add(30, 'm')
				while (start.date() !== lastDay.date()) {
					const tempEnd = start.clone().add(1, 'd').set({ 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0 })
					tempRenderList.push({ startAt: start, endAt: tempEnd })
					start = tempEnd
				}
				tempRenderList.push({ startAt: start, endAt: end })
			}
			return {
				...state,
				dragInfo: {
					...state.dragInfo,
					secondPoint: actions.date
				},
				renderList: tempRenderList
			}
		case ACTIONS.RESET:
			return {
				...state,
				dragInfo: {
					firstPoint: undefined,
					secondPoint: undefined,
				},
				renderList: [],
				isDragging: false,
				isDropped: false
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

export const setCalendar = (calendarType, saturdayList = undefined) => {
	return {
		type: ACTIONS.CALENDAR,
		calendarType,
		saturdayList
	}
}

export const startDrag = (date) => {
	return {
		type: ACTIONS.START,
		date
	}
}

export const resetDrag = () => {
	return {
		type: ACTIONS.RESET,
	}
}

export const drop = () => {
	return {
		type: ACTIONS.DROP,
	}
}

export const updateDrag = (date) => {
	return {
		type: ACTIONS.UPDATE,
		date
	}
}

export default reducer
