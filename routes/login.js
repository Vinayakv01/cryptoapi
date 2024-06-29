// Import required modules
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Adjust path as needed
const router = express.Router();

// Login endpoint
router.post('/login', (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Please provide both login and password' });
  }

  try {
    // Check if user exists in the database
    db.query('SELECT * FROM users WHERE login = ? AND password = ?', [login, password], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid login credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: results[0].id, login: results[0].login }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

      // Send token and userId as response
      res.status(200).json({ token, userId: results[0].id });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
