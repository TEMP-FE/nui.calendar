import React, { createContext, useContext, useReducer } from 'react'
import moment from 'moment'

import Schedule from '../utils/Schedule'

import calendarReducer from '../reducers/calendar'
import { CATEGORY_NAME } from '../constants/defaultCategory'

const appContext = createContext(null)

const { Provider } = appContext

const initialState = {
	scheduleList: [
		new Schedule({
			title: '테스트 F',
			startAt: moment('2021-02-04 17:30'),
			endAt: moment('2021-02-04 18:30'),
			category: CATEGORY_NAME.PERSONAL,
			isAllDay: true,
			isBlocked: false,
		}),
		new Schedule({
			title: '테스트 E',
			startAt: moment('2021-02-04 15:30'),
			endAt: moment('2021-02-04 17:00'),
			category: CATEGORY_NAME.PERSONAL,
			isAllDay: true,
			isBlocked: false,
		}),
		new Schedule({
			title: '테스트 D',
			startAt: moment('2021-02-04 09:30'),
			endAt: moment('2021-02-04 15:00'),
			category: CATEGORY_NAME.PERSONAL,
			isAllDay: true,
			isBlocked: false,
		}),
		new Schedule({
			title: '테스트 C',
			startAt: moment('2021-02-04 14:30'),
			endAt: moment('2021-02-04 16:00'),
			category: CATEGORY_NAME.PERSONAL,
			isAllDay: true,
			isBlocked: false,
		}),
		new Schedule({
			title: '테스트 B',
			startAt: moment('2021-02-04 13:30'),
			endAt: moment('2021-02-04 15:00'),
			category: CATEGORY_NAME.PERSONAL,
			isAllDay: true,
			isBlocked: false,
		}),
		new Schedule({
			title: '테스트 A',
			startAt: moment('2021-02-03 13:00'),
			endAt: moment('2021-02-03 17:30'),
			category: CATEGORY_NAME.PERSONAL,
			isAllDay: true,
			isBlocked: false,
		}),
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
