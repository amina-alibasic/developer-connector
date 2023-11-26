const mongoose = require("mongoose");
// Create a schema containing different fields we want this resource to have

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // this doesn't allow empty strings either
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
