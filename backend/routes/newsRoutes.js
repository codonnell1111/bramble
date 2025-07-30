const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/news
router.get('/', async (req, res) => {
  res.json([{ id: 1, title: "Welcome to Bramble News" }]);
  try {
    const result = await pool.query(
      'SELECT * FROM news ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
