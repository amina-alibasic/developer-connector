import express from 'express';
import connectDB from './config/db';

// This here offers a range of functionalities
const app = express();

// Connect to the DB
connectDB();

// end point to test the connection
// takes a GET req to '/', the res just sends data to the browser
app.get('/', (req,res) => res.send('API Running'));

// Define routes
// use is a middleware function used as an entry point for all HTTP requests
app.use('/api/users', require('./config/routes/api/users').default);
app.use('/api/auth', require('./config/routes/api/auth').default);
app.use('/api/profile', require('./config/routes/api/profile').default);
app.use('/api/posts', require('./config/routes/api/posts').default);


// this looks for an env variable PORT when the app is deployed, but locally will listen on port 5000
const PORT = process.env.PORT || 5000; 
// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
