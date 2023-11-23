// Connect to MongoDB using Mongoose, with URI from config.js
const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

// asynchronous arrow function for connecting
const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB Connected!')
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

// export the function
module.exports = connectDB;