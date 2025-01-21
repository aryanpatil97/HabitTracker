import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const[habiits,setHabitts]=useState([])
  const[name,setName]=useState('')
  const[category,setCategory]=useState('')
  const[tags,setTags]=useState('')
  const[editingId,setEditingId]=useState(null)
  const[isCompleted, setIsCompleted]=useState(false)
  const[filterCategory,setFilterCategory]=useState('')
  const[filterTag,setFilterTag]=useState('')

 

  const fetchData=async() =>{
    try{
      const response=await axios.get('http://localhost:5000/habits');
      setHabitts(response.data)
    }catch(error){
      console.error(error)
    }
  }
 useEffect(() =>{
  fetchData()
 })

 const editHabit =(habit) =>{
  setName(habit.name)
  setCategory(habit.category)
  setEditingId(habit._id)
  setIsCompleted(habit.isCompleted)
  setTags(habit.tags ? habit.tags.join(', ') : '')

 }

const addOrUpdateHabit= async() =>{
   try{
    if(editingId){
      const response= await axios.put(`http://localhost:5000/habits/${editingId}`,{
        name,
        isCompleted,
        category,
        tags:tags.split(',').map(tag => tag.trim()),
      })
      setHabitts(habiits.map((habit) => (habit._id === editingId ? response.data : habit)))
     
    }else{

    
    const response= await axios.post('http://localhost:5000/habits',{
      name,
      category,
      tags:tags.split(',').map(tag => tag.trim()),
    })
    setHabitts([...habiits,response.data])
   }
   setName('')
   setCategory('')
   setTags('')
   setEditingId(null)
   setIsCompleted(false)
}catch(error){
  console.error(error)
}
}

const filterHabits= habiits.filter((habit) =>{
  if(filterCategory &&  habit.category !== filterCategory) return false;
  if(filterTag &&  !habit.tags?.includes(filterTag)) return false;
  return true

})

const deleteHabit=async(id) =>{
  try{
    await axios.delete(`http://localhost:5000/habits/${id}`)
    setHabitts(habiits.filter((habit) => habit._id !== id))
  }catch(error){
    console.error(error)
  }
}
  return (
    <>
    <div  className='min-h-screen bg-gradient-to-tr from-purple-600 to-blue-900  text-white flex flex-row items-start justify-center'>
      <div className='w-1/3 p-6'>
        <h1 className='text-4xl font-extrabold mt-6 drop-shadow-lg '>Habit Tracker</h1>
        <div className='mt-6'>
          <input value={name}  onChange={(e) => setName(e.target.value)} placeholder='Habit name' className='w-full p-3 rounded bg-gray-800 text-white shadow-lg mb-2'></input>
          <input value={category}  onChange={(e) => setCategory(e.target.value)} placeholder='Category (e.g., Health,Game) name' className='w-full p-3 rounded bg-gray-800 text-white shadow-lg mb-2'></input>
          <input value={tags}  onChange={(e) => setTags(e.target.value)} placeholder='Tags(comma-seperated) ' className='w-full p-3 rounded bg-gray-800 text-white shadow-lg mb-2'></input>
         <button onClick={addOrUpdateHabit} className='w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500text-white rounded mb-2'>
          
          {editingId ? 'Update Habit' : 'Add Habit'}
          
          </button>
        </div>

        <div className='nt-6 w-full flex justify-between space-x-2'>
          <select 
           value={filterCategory}
           onChange={(e) => setFilterCategory(e.target.value)}
          className='w-1/2 p-3 bg-gray-800 text-white rounded shadow-lg'>

            <option value="">Filter by Category</option>
            {[...new Set(habiits.map((habit) => habit.category))].map((cat) =>(
                 <option key={cat}>{cat}</option>
            ))}
           


          </select>
          <select 
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          className='w-1/2 p-3 bg-gray-800 text-white rounded shadow-lg'>
             <option value="">Filter by Tags</option>
            {[...new Set(habiits.flatMap((habit) => habit.tags || []))].map((tag) =>(
                 <option key={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>


      <div className='w-2/3 p-6'>
        <ul className='mt-6 w-full '>
        {filterHabits.map((habit) => (
          <li 
            key={habit._id}
          className='flex flex-col bg-gray-700 p-4 rounded mt-2 shadow-lg'>

            <div className='flex justify-between items-center'>
              <span>{habit.name}</span>
              <div className='flex space-x-2'>
                <button className='text-yellow-400'
                  onClick={() => editHabit(habit)}
                >Edit</button>
                <button className='text-red-400' onClick={() => deleteHabit(habit._id)}>Delete</button>
              </div>
            </div>
            <div>
              <span>Category:{habit.category}</span><br/>
              <span>Tags:{habit.tags?.join(', ') || 'None'}</span>
            </div>
          </li>
        ))}
        </ul>
      </div>
    </div>
    </>
  )
}

export default App
