export const calendarType = {
    MONTH: 'MONTH',
    WEEK: 'WEEK'
}

export const dateInitialState = {
    dragInfo: {
        firstPoint: undefined,
        secondPoint: undefined,
    },
    saturdayList: [],
    renderList: [],
    isDragging: false,
    isDropped: false,
    calendarType: undefined
}

export const scheduleInitialState = {
    dragInfo: {
        index: -1,
        startAt: undefined,
        endAt: undefined,
        diff: undefined,
    },
    isResizing: false,
    isDragging: false,
    isDropped: false,
    calendarType: undefined
}
