const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to the DB
connectDB();

// end point to test the connection
// takes a GET req to '/', the res just sends data to the browser
app.get('/', (req,res) => res.send('API Running'));

// Define routes
app.use('/api/users', require('./config/routes/api/users'));
app.use('/api/auth', require('./config/routes/api/auth'));
app.use('/api/profile', require('./config/routes/api/profile'));
app.use('/api/posts', require('./config/routes/api/posts'));


// this looks for an env variable PORT when the app is deployed, but locally will listen on port 5000
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
