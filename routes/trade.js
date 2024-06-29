// Import required modules
const express = require('express');
const db = require('../config/db'); // Adjust path as needed
const router = express.Router();

// Buy endpoint
router.post('/trade/buy', (req, res) => {
  const { userId, symbol, amount } = req.body;

  if (!userId || !symbol || !amount) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  // Check if the user already has a trade for the symbol
  const selectSql = 'SELECT * FROM trades WHERE user_id = ? AND symbol = ?';
  db.query(selectSql, [userId, symbol], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      // Update existing trade
      const updateSql = 'UPDATE trades SET amount = amount + ?, type = ? WHERE user_id = ? AND symbol = ?';
      const updateValues = [amount, 'buy', userId, symbol];
      
      db.query(updateSql, updateValues, (updateError, updateResults) => {
        if (updateError) {
          console.error(updateError);
          return res.status(500).json({ message: 'Internal server error' });
        }
        
        return res.status(200).json({ message: 'Buy trade successful - Updated existing record' });
      });
    } else {
      // Insert new trade
      const insertSql = 'INSERT INTO trades (user_id, symbol, amount, type) VALUES (?, ?, ?, ?)';
      const insertValues = [userId, symbol, amount, 'buy'];
      
      db.query(insertSql, insertValues, (insertError, insertResults) => {
        if (insertError) {
          console.error(insertError);
          return res.status(500).json({ message: 'Internal server error' });
        }
        
        return res.status(200).json({ message: 'Buy trade successful - Created new record' });
      });
    }
  });
});

// Sell endpoint
router.post('/trade/sell', (req, res) => {
  const { userId, symbol, amount } = req.body;

  if (!userId || !symbol || !amount) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  // Check if the user already has a trade for the symbol
  const selectSql = 'SELECT * FROM trades WHERE user_id = ? AND symbol = ?';
  db.query(selectSql, [userId, symbol], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      const currentAmount = results[0].amount;

      // Check if selling all coins of this symbol
      if (amount >= currentAmount) {
        // Delete the trade since amount will be zero after sell
        const deleteSql = 'DELETE FROM trades WHERE user_id = ? AND symbol = ?';
        db.query(deleteSql, [userId, symbol], (deleteError, deleteResults) => {
          if (deleteError) {
            console.error(deleteError);
            return res.status(500).json({ message: 'Internal server error' });
          }

          return res.status(200).json({ message: 'Sell trade successful - Deleted record' });
        });
      } else {
        // Update existing trade with reduced amount
        const updateSql = 'UPDATE trades SET amount = amount - ?, type = ? WHERE user_id = ? AND symbol = ?';
        const updateValues = [amount, 'sell', userId, symbol];
        
        db.query(updateSql, updateValues, (updateError, updateResults) => {
          if (updateError) {
            console.error(updateError);
            return res.status(500).json({ message: 'Internal server error' });
          }
          
          return res.status(200).json({ message: 'Sell trade successful - Updated existing record' });
        });
      }
    } else {
      // Insert new trade (this scenario should not happen if coins are managed correctly)
      return res.status(404).json({ message: 'Cannot sell. Coin not found.' });
    }
  });
});

module.exports = router;








// // Import required modules
// const express = require('express');
// const db = require('../config/db'); // Adjust path as needed
// const router = express.Router();

// // Buy endpoint
// router.post('/trade/buy', (req, res) => {
//   const { userId, symbol, amount } = req.body;

//   if (!userId || !symbol || !amount) {
//     return res.status(400).json({ message: 'Missing required parameters' });
//   }

//   // Example query to insert trade into trades table
//   const sql = 'INSERT INTO trades (user_id, symbol, amount, type) VALUES (?, ?, ?, ?)';
//   const values = [userId, symbol, amount, 'buy'];

//   db.query(sql, values, (error, results) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }

//     return res.status(200).json({ message: 'Buy trade successful' });
//   });
// });

// // Sell endpoint
// router.post('/trade/sell', (req, res) => {
//   const { userId, symbol, amount } = req.body;

//   if (!userId || !symbol || !amount) {
//     return res.status(400).json({ message: 'Missing required parameters' });
//   }

//   // Example query to insert trade into trades table
//   const sql = 'INSERT INTO trades (user_id, symbol, amount, type) VALUES (?, ?, ?, ?)';
//   const values = [userId, symbol, amount, 'sell'];

//   db.query(sql, values, (error, results) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }

//     return res.status(200).json({ message: 'Sell trade successful' });
//   });
// });

// module.exports = router;
