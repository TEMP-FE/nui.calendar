import React from 'react'

const Draggbale = ({data, setDraggingItem, setRemoveDragged, removeIndex, setCode, count}) => {
  const handleDragStart = (e,data) => {
    e.target.style.opacity="0.5"
    setDraggingItem(data)
    setRemoveDragged(removeIndex)
    setCode(count);
  }
  const handleDragEnd = (e) => {
    e.target.style.opacity = "";
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }
// 이동

  return (
    <div draggable
      onDragStart={e=>handleDragStart(e,data)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}>
      {data.name}
    </div>
  );
}

export default Draggbale;