const express = require("express");
const connectDB = require("./config/db");

// This here offers a range of functionalities
const app = express();

// Connect to the DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false })); // allows getting the date in request.body in routes

// end point to test the connection
// takes a GET req to '/', the res just sends data to the browser
app.get("/", (req, res) => res.send("API Running"));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// this looks for an env variable PORT when the app is deployed, but locally will listen on port 5000
const PORT = process.env.PORT || 5000;
// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
