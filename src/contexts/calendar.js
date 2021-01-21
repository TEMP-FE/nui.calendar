import React, { createContext, useContext, useReducer } from 'react'
import calendarReducer from '../reducers/calendar'

const appContext = createContext(null)

const { Provider } = appContext

const initialState = {
	scheduleList: [
		{
			calendarId: 1,
			title: '테스트',
			startAt: new Date('2021-01-28 13:00'),
			endAt: new Date('2021-01-28 17:30'),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isRepeatable: false,
		},
		{
			calendarId: 2,
			title: '테스트',
			startAt: new Date('2021-01-29 14:30'),
			endAt: new Date('2021-01-29 16:00'),
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
