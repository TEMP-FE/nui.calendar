import React, { createContext, useContext, useReducer } from 'react'
import { dateInitialState, scheduleInitialState } from '../const/drag'
import dragDateReducer from '../reducers/dragDate'
import dragScheduleReducer from '../reducers/dragSchedule'

const appContext = createContext(null)

const { Provider } = appContext

export const DragContext = ({ children }) => {
    const [dragDateStore, dragDateDispatch] = useReducer(dragDateReducer, dateInitialState)
    const [dragScheduleStore, dragScheduleDispatch] = useReducer(dragScheduleReducer, scheduleInitialState)

    return (
        <Provider
            value={{
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

export const useDragDateContext = () => useContext(appContext).DragDateContext
export const useDragScheduleContext = () => useContext(appContext).DragScheduleContext
