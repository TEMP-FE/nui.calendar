import React,{useState, useEffect} from 'react';
import Draggbale from './Draggable';

const Droppable = ({listData, setDraggingItem, draggingItem, removeDragged, setRemoveDragged, count,code,setCode}) => {
  const [list, setList] = useState(listData);
  const removeIndex = (index) => {
    return ()=> () => setList(list.filter((v, currentIndex) => currentIndex !== index))
  }
  const handleDragEnter = (e) => {
    e.target.style.background = "purple";
  }

  const handleDragLeave = (e) => {
    e.target.style.background = "";
  }
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDrop = (e) => {
    e.preventDefault();
    if(code!==count) {
      e.target.style.background = "";
      setList([...list, draggingItem])
      removeDragged();
    }
  }
  return (
    <div className="day"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      {list && list.map((data, index) => <Draggbale count={count} 
        removeIndex={removeIndex(index)} 
        setDraggingItem={setDraggingItem} 
        data={data} 
        setCode={setCode}
        count={count}
        setRemoveDragged={setRemoveDragged} />)}
    </div>
  );
}

export default Droppable;