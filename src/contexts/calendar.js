import React, { createContext, useContext, useReducer } from 'react'
import calendarReducer from '../reducers/calendar'

const appContext = createContext(null)

const { Provider } = appContext

const initialState = {
	scheduleList: [
		{
			calendarId: Math.random(),
			title: '일정 1',
			startAt: new Date(2020, 9, 1),
			endAt: new Date(2020, 9, 5),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			calendarId: Math.random(),
			title: '일정 2',
			startAt: new Date(2020, 9, 19),
			endAt: new Date(2020, 9, 20),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			calendarId: Math.random(),
			title: '일정 3',
			startAt: new Date(2020, 9, 30),
			endAt: new Date(2020, 9, 31),
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

	return (
		<Provider
			value={{
				CalendarContext: {
					calendarStore,
					calendarDispatch,
				},
			}}
		>
			{children}
		</Provider>
	)
}

export const useCalendarContext = () => useContext(appContext).CalendarContext
