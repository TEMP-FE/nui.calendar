import React, { createContext, useContext, useReducer } from 'react'
import calendarReducer from '../reducers/calendar'
import { dateInitialState, scheduleInitialState } from '../const/drag'
import dragDateReducer from '../reducers/dragDate'
import dragScheduleReducer from '../reducers/dragSchedule'

const appContext = createContext(null)

const { Provider } = appContext

const initialState = {
	scheduleList: [
		{
			calendarId: 1,
			title: '테스트',
			startAt: new Date('2020-12-10 13:00'),
			endAt: new Date('2020-12-10 17:30'),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isRepeatable: false,
		},
		{
			calendarId: 2,
			title: '테스트',
			startAt: new Date('2020-12-11 14:30'),
			endAt: new Date('2020-12-11 16:00'),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isRepeatable: false,
		},
	],
}

const initializer = (state) => {
	return state
}

export const AppContext = ({ children }) => {
	const [calendarStore, calendarDispatch] = useReducer(calendarReducer, initialState, initializer)
	const [dragDateStore, dragDateDispatch] = useReducer(dragDateReducer, dateInitialState, initializer)
	const [dragScheduleStore, dragScheduleDispatch] = useReducer(dragScheduleReducer, scheduleInitialState, initializer)

	return (
		<Provider
			value={{
				CalendarContext: {
					calendarStore,
					calendarDispatch,
				},
				DragDateContext: {
					dragDateStore,
					dragDateDispatch,
				},
				DragScheduleContext: {
					dragScheduleStore,
					dragScheduleDispatch,
				},
			}}
		>
			{children}
		</Provider>
	)
}

export const useCalendarContext = () => useContext(appContext).CalendarContext
export const useDragDateContext = () => useContext(appContext).DragDateContext
export const useDragScheduleContext = () => useContext(appContext).DragScheduleContext
