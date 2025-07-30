// backend/models/userModel.js
const db = require('../db');

async function createUser({ username, email, password }) {
  const result = await db.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, created_at`,
    [username, email, password]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
}

async function getUserById(id) {
  const result = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
}

async function updateUserAvatar(id, avatar) {
  await db.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatar, id]);
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserAvatar,
};
