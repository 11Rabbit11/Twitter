const express = require('express');
const app = express();
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "/images")));

//Import cors and mongoose libraries
const cors = require('cors');
const mongoose = require('mongoose');

// Import the MONGODB_URL from the config file
const { MONGODB_URL } = require('./config');

console.clear();

// Connect to MongoDB using the MONGODB_URL
mongoose.connect(MONGODB_URL);

// When the connection is established, log a message
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected');
});

// If there is an error connecting to MongoDB, log the error
mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB', error);
});

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Parse incoming requests with JSON payloads
app.use(express.json());

// Import Models
require('./models/user_model');
require('./models/tweet_model');

//Routes
app.use('/api/user', require('./routes/user_route'));
app.use('/api/tweet', require('./routes/tweet_route'));
app.use('/api/auth', require('./routes/auth_route'));

// Start the server on port 5000
app.listen(5000, () => {
    console.log("Server has Started");
});
