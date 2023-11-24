// Connect to MongoDB using Mongoose, with URI from config.js
/* 
Moongoose: 
- provides a way to interact with MongoDB using JavaScript objects 
- enables performing CRUD operations on MongoDB collections using JavaScript functions
- provides a querying API that allows constructing complex queries for MongoDB
*/
const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

// asynchronous arrow function for connecting
const connectDB = async () => {
  try {
    await mongoose.connect(db); // waits for asynchronous operation (connect) to complete
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
// The function returns a Promise that resolves with the fetched data
// which can be handled with .then()

// export the function
module.exports = connectDB;
