// backend/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL connection

// CREATE a new post
router.post('/', async (req, res) => {
  const { userId, content } = req.body;
  if (!userId || !content) {
    return res.status(400).json({ error: 'userId and content are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [userId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all posts (optionally filtered by userId)
router.get('/', async (req, res) => {
  const userId = req.query.userId;

  try {
    const result = userId
      ? await pool.query(
          `SELECT posts.*, users.username, users.avatar
           FROM posts
           JOIN users ON posts.user_id = users.id
           WHERE user_id = $1
           ORDER BY posts.created_at DESC`,
          [userId]
        )
      : await pool.query(
          `SELECT posts.*, users.username, users.avatar
           FROM posts
           JOIN users ON posts.user_id = users.id
           ORDER BY posts.created_at DESC`
        );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a post by ID (optional)
router.delete('/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/top-liked', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT posts.*, users.username, COUNT(likes.id) AS like_count
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      GROUP BY posts.id, users.username
      ORDER BY like_count DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching top liked posts:', err);
    res.status(500).json({ error: 'Failed to fetch top liked posts' });
  }
});

// GET /api/posts/trending
router.get('/trending', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, u.username, COUNT(l.id) AS like_count
      FROM   posts  p
      JOIN   users  u ON u.id = p.user_id
      LEFT JOIN likes l ON l.post_id = p.id
      WHERE  p.created_at >= NOW() - interval '24 hours'
      GROUP  BY p.id, u.username
      ORDER  BY like_count DESC, p.created_at DESC
      LIMIT  10;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching trending posts:', err);
    res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
});


module.exports = router;
