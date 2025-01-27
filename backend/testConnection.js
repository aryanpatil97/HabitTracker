const mongoose = require('mongoose');

const uri = 'mongodb+srv://HabiTrackerAdmin:HabiTrackerPassword@cluster0.n7lu7.mongodb.net/habit-db2?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB connected successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });