const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['https://habit-tracker-lcpk.vercel.app'], // Allow your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Enable cookies if needed
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('🟢 MongoDB Connected'))
    .catch(err => console.error('🔴 MongoDB Connection Error:', err.message));

// Habit Schema
const habitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Habit = mongoose.model('Habit', habitSchema);

// CRUD Endpoints
app.post('/api/habits', async (req, res) => {
    try {
        const habit = new Habit(req.body);
        await habit.save();
        res.status(201).json(habit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/habits', async (req, res) => {
    try {
        const habits = await Habit.find().sort({ createdAt: -1 });
        res.json(habits);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch habits' });
    }
});

app.put('/api/habits/:id', async (req, res) => {
    try {
        const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedHabit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/habits/:id', async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Habit deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));