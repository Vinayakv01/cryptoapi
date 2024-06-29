// usercoin.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path as needed

// GET user coins by userId
router.get('/userCoins/:userId', (req, res) => {
  const userId = req.params.userId;

  db.query('SELECT * FROM trades WHERE user_id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user coins:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
