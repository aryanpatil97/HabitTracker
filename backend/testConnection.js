const mongoose = require('mongoose');

const uri = 'mongodb+srv://<db_name>:<db_password>@cluster0.n7lu7.mongodb.net/habit-db2?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB connected successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
