// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const loginRoute = require('./routes/login'); // Adjust path as needed
const tradeRoute = require('./routes/trade'); // Adjust path as needed
const userCoinsRoute = require('./routes/usercoin'); // Adjust path as needed

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS with specific origin
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Replace with your client URL
  credentials: true,
}));

// Routes
app.use('/api', loginRoute); // Use the login route
app.use('/api', tradeRoute); // Use the trade route
app.use('/api', userCoinsRoute); // Use the userCoins route

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
