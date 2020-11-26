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
			startAt: new Date('2020-11-23 07:30'),
			endAt: new Date('2020-11-23 09:30'),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			calendarId: 2,
			title: '테스트',
			startAt: new Date('2020-11-26 07:30'),
			endAt: new Date('2020-11-27 04:00'),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
	],
}

const initializer = () => {
	return initialState
}

export const AppContext = ({ children }) => {
	const [calendarStore, calendarDispatch] = useReducer(calendarReducer, initialState, initializer)
	const [dragDateStore, dragDateDispatch] = useReducer(dragDateReducer, dateInitialState)
	const [dragScheduleStore, dragScheduleDispatch] = useReducer(dragScheduleReducer, scheduleInitialState)

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
					dragScheduleDispatch
				}
			}}
		>
			{children}
		</Provider>
	)
}

export const useCalendarContext = () => useContext(appContext).CalendarContext
export const useDragDateContext = () => useContext(appContext).DragDateContext
export const useDragScheduleContext = () => useContext(appContext).DragScheduleContext
