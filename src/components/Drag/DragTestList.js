import React, { useState } from 'react'
import Droppable from './Droppable'

const list = [
	[
		{ name: '0', data: 'hi' },
		{ name: '1', data: 'hi' },
		{ name: '2', data: 'hi' },
		{ name: '3', data: 'hi' },
		{ name: '4', data: 'hi' },
		{ name: '5', data: 'hi' },
		{ name: '6', data: 'hi' },
	],
	[
		{ name: '11', data: 'hi' },
		{ name: '11', data: 'hi' },
		{ name: '12', data: 'hi' },
		{ name: '13', data: 'hi' },
		{ name: '14', data: 'hi' },
		{ name: '15', data: 'hi' },
		{ name: '16', data: 'hi' },
	],
	[
		{ name: '21', data: 'hi' },
		{ name: '21', data: 'hi' },
		{ name: '22', data: 'hi' },
		{ name: '23', data: 'hi' },
		{ name: '24', data: 'hi' },
		{ name: '25', data: 'hi' },
		{ name: '26', data: 'hi' },
	],
	[
		{ name: '31', data: 'hi' },
		{ name: '31', data: 'hi' },
		{ name: '32', data: 'hi' },
		{ name: '33', data: 'hi' },
		{ name: '34', data: 'hi' },
		{ name: '35', data: 'hi' },
		{ name: '36', data: 'hi' },
	],
	[
		{ name: '41', data: 'hi' },
		{ name: '41', data: 'hi' },
		{ name: '42', data: 'hi' },
		{ name: '43', data: 'hi' },
		{ name: '44', data: 'hi' },
		{ name: '45', data: 'hi' },
		{ name: '46', data: 'hi' },
	],
	[
		{ name: '51', data: 'hi' },
		{ name: '51', data: 'hi' },
		{ name: '52', data: 'hi' },
		{ name: '53', data: 'hi' },
		{ name: '54', data: 'hi' },
		{ name: '55', data: 'hi' },
		{ name: '66', data: 'hi' },
	],
]

const DragTestList = () => {
	const [draggingItem, setDraggingItem] = useState(undefined)
	const [removeDragged, setRemoveDragged] = useState(undefined)
	const [code, setCode] = useState(undefined)
	let count = 0
	return (
		<div className="month">
			{list.map((data) => (
				<div className="week">
					{data.map((day) => (
						<Droppable
							listData={[day]}
							setDraggingItem={setDraggingItem}
							draggingItem={draggingItem}
							removeDragged={removeDragged}
							setRemoveDragged={setRemoveDragged}
							count={count++}
							code={code}
							setCode={setCode}
						/>
					))}
				</div>
			))}
		</div>
	)
}

export default DragTestList
