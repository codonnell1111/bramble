// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;

// ========== REGISTER ==========
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.createUser({ username, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// ========== LOGIN ==========
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ========== GET CURRENT USER FROM TOKEN ==========
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.getUserById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error('Invalid token', err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ========== AVATAR UPLOAD SETUP ==========
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ dest: 'uploads/' });

// ========== AVATAR UPLOAD ROUTE ==========
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    user.avatar = avatarPath;
    await User.updateUserAvatar(userId, avatarPath);

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// GET /api/users/new
router.get('/new', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, username, avatar, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching new users:', err);
    res.status(500).json({ error: 'Failed to fetch new users' });
  }
});

// GET /api/users/suggested?userId=#
router.get('/suggested', async (req, res) => {
  const userId = parseInt(req.query.userId);
  if (!userId) return res.status(400).json({ error: 'Missing userId parameter' });

  try {
    const { rows } = await pool.query(`
      SELECT id, username, avatar
      FROM users
      WHERE id != $1
        AND id NOT IN (
          SELECT followee_id FROM follows WHERE follower_id = $1
        )
      ORDER BY created_at DESC
      LIMIT 10;
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching suggested users:', err);
    res.status(500).json({ error: 'Failed to fetch suggested users' });
  }
});


module.exports = router;
