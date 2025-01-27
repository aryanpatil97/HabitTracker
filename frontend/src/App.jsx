import { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { FiPlus, FiEdit, FiTrash, FiCheck, FiX, FiTag } from 'react-icons/fi';

const socket = io('https://habittracker-eywk.onrender.com'); // Socket.io server

function App() {
  const [habits, setHabits] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: '', tags: '', editingId: null });
  const [filters, setFilters] = useState({ category: '', tag: '' });

  const API_URL = 'https://habittracker-eywk.onrender.com/api/habits';

  // Fetch habits initially
  useEffect(() => {
    socket.on('updateHabits', (updatedHabits) => setHabits(updatedHabits));

    return () => socket.off('updateHabits');
  }, []);

  // Form handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return;

    try {
      const habitData = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
      };

      if (formData.editingId) {
        await axios.put(`${API_URL}/${formData.editingId}`, habitData);
      } else {
        await axios.post(API_URL, habitData);
      }

      setFormData({ name: '', category: '', tags: '', editingId: null });
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this habit permanently?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const filteredHabits = useMemo(
    () =>
      habits.filter(
        (h) =>
          (!filters.category || h.category === filters.category) &&
          (!filters.tag || h.tags?.includes(filters.tag))
      ),
    [habits, filters]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Habit Tracker
          </h1>
        </header>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Form Section */}
          <div className="bg-gray-800/40 p-6 rounded-lg shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Habit Name"
                className="w-full bg-gray-700 p-3 rounded-lg focus:ring-2 ring-indigo-400"
              />
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category"
                className="w-full bg-gray-700 p-3 rounded-lg focus:ring-2 ring-indigo-400"
              />
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Tags (comma separated)"
                className="w-full bg-gray-700 p-3 rounded-lg focus:ring-2 ring-indigo-400"
              />
              <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white p-3 rounded-lg">
                {formData.editingId ? 'Update Habit' : 'Add Habit'}
              </button>
            </form>
          </div>

          {/* Habits Section */}
          <div className="md:col-span-3 space-y-4">
            {filteredHabits.map((habit) => (
              <div key={habit._id} className="bg-gray-800 p-5 rounded-lg shadow-xl flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{habit.name}</h3>
                  <p className="text-sm text-gray-400">{habit.category}</p>
                  <div className="flex space-x-2 mt-2">
                    {habit.tags.map((tag) => (
                      <span key={tag} className="bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() =>
                      setFormData({
                        name: habit.name,
                        category: habit.category,
                        tags: habit.tags.join(', '),
                        editingId: habit._id,
                      })
                    }
                    className="bg-blue-500 p-2 rounded text-white"
                  >
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(habit._id)} className="bg-red-500 p-2 rounded text-white">
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;