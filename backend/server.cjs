const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['https://habit-tracker-lcpk.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

app.use(express.json());
app.use(cors({
    origin: ['https://habit-tracker-lcpk.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
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

// Notify all clients when data changes
const notifyClients = async () => {
    const habits = await Habit.find().sort({ createdAt: -1 });
    io.emit('updateHabits', habits);
};

// CRUD Endpoints
app.post('/api/habits', async (req, res) => {
    try {
        const habit = new Habit(req.body);
        await habit.save();
        await notifyClients();
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
        await notifyClients();
        res.json(updatedHabit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/habits/:id', async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        await notifyClients();
        res.json({ message: 'Habit deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Real-time updates
io.on('connection', (socket) => {
    console.log('🟢 A user connected');
    socket.on('disconnect', () => console.log('🔴 A user disconnected'));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));