import React from 'react'
import { DragContext } from '../contexts/drag'

const Calendar = ({ calendar }) => (
    <DragContext>
        {calendar}
    </DragContext>
)

export default Calendar