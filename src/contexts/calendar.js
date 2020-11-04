import React, { createContext, useContext, useReducer } from 'react'
import calendarReducer from '../reducers/calendar'

const appContext = createContext(null)

const { Provider } = appContext

const initialState = {}

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

export const useCalenderContext = () => useContext(appContext).CalendarContext
