import React, { createContext, useContext, useReducer } from 'react'
import calendarReducer from '../reducers/calendar'

const appContext = createContext(null)

const { Provider } = appContext

const initialState = {
	scheduleList: [
		{
			title: '테스트',
			startAt: new Date('2020-11-17 07:30'),
			endAt: new Date('2020-11-17 08:31'),
			location: '',
			category: '',
			isAllDay: true,
			isBlocked: false,
			isPrivate: false,
			isRepeatable: false,
		},
		{
			title: '테스트',
			startAt: new Date('2020-11-17 07:30'),
			endAt: new Date('2020-11-18 04:31'),
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
