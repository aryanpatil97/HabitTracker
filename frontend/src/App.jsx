import { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { FiPlus, FiEdit, FiTrash, FiCheck, FiX, FiTag } from 'react-icons/fi';

const socket = io('https://habittracker-eywk.onrender.com');

const MOTIVATIONAL_MESSAGES = [
  "Consistency is the key to mastery!",
  "Small steps lead to big changes!",
  "You're building a better version of yourself!",
  "Every habit counts – keep going!",
  "Progress, not perfection!",
  "Stay committed to your goals!",
  "Your future self will thank you!",
  "Great things never come from comfort zones!",
  "You're stronger than your excuses!",
  "Success is a series of small wins!",
  "Make each day your masterpiece!",
  "The secret of getting ahead is getting started!",
  "Don't count the days, make the days count!",
];

function App() {
  const [habits, setHabits] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: '', tags: '', editingId: null });
  const [filters, setFilters] = useState({ category: '', tag: '' });
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const API_URL = 'https://habittracker-eywk.onrender.com/api/habits';

  useEffect(() => {
    socket.on('updateHabits', (updatedHabits) => setHabits(updatedHabits));
    return () => socket.off('updateHabits');
  }, []);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setIsTyping(false);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
        setIsTyping(true);
      }, 1000);
    }, 5000);

    return () => clearInterval(messageInterval);
  }, []);

  // ... keep all your existing logic the same ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-gray-100">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300 mb-4 animate-fade-in">
            Habit Tracker
          </h1>
          <div className="h-12 flex items-center justify-center">
            <div className={`text-lg text-purple-200 italic transition-opacity duration-500 ${isTyping ? 'opacity-100' : 'opacity-0'}`}>
              <span className="typing-animation">{MOTIVATIONAL_MESSAGES[currentMessage]}</span>
              <span className="cursor-blink">|</span>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Form Section */}
          <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Habit Name"
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all placeholder-gray-400"
                />
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Category"
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all placeholder-gray-400"
                />
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Tags (comma separated)"
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold p-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-purple-500/20"
              >
                {formData.editingId ? 'Update Habit' : 'Add Habit'}
              </button>
            </form>
          </div>

          {/* Habits Section */}
          <div className="md:col-span-3 space-y-4">
            {filteredHabits.map((habit) => (
              <div
                key={habit._id}
                className="group bg-gray-800/40 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50 hover:border-purple-400/30 transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg hover:shadow-xl hover:shadow-purple-500/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-between relative">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-purple-100 mb-1">{habit.name}</h3>
                    <p className="text-sm font-medium text-purple-300/80 mb-2">{habit.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {habit.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-100 text-xs font-medium"
                        >
                          <FiTag className="mr-1.5 h-3 w-3" />#{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() =>
                        setFormData({
                          name: habit.name,
                          category: habit.category,
                          tags: habit.tags.join(', '),
                          editingId: habit._id,
                        })
                      }
                      className="p-2 rounded-lg bg-gray-700/50 hover:bg-purple-500/20 border border-gray-600/30 hover:border-purple-400/30 transition-colors duration-200"
                    >
                      <FiEdit className="w-5 h-5 text-purple-300" />
                    </button>
                    <button
                      onClick={() => handleDelete(habit._id)}
                      className="p-2 rounded-lg bg-gray-700/50 hover:bg-red-500/20 border border-gray-600/30 hover:border-red-400/30 transition-colors duration-200"
                    >
                      <FiTrash className="w-5 h-5 text-red-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink {
          50% { border-color: transparent; }
        }

        .typing-animation {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typing 1s steps(40, end);
        }

        .cursor-blink {
          animation: blink 1s step-end infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;