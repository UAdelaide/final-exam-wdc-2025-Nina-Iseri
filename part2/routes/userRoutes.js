const express = require('express');
const router = express.Router();
const db = require('../models/db');
require('dotenv').config();

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role, password_hash FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.status(200).json({user: req.session.user_id});
});

// POST logout
router.post('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to log out' });
    }
    res.clearCookie('username');
    res.clearCookie('role');
    return res.status(200);
  });

});

// GET all dogs of a user
router.get('/my-dogs', async (req, res) => {
  const user_id = Number(req.session.user_id) || 0;
  if (!user_id) {
    console.log("not logged in");
    return res.status(500).json({ error: 'Not logged in' });
  }

  try {
    const [rows] = await db.query(`
      SELECT dog_id, name
      FROM Dogs
      WHERE owner_id = ?
    `, [user_id]);
    res.json(rows);
  } catch (err) {
    console.log("no db");
    return res.status(500).json({ error: 'Unable to query database'});
  }
});

// POST login
router.post('/login', async (req, res) => {
  const { user, pass } = req.body;
  const maxAge = 86400000;

  try {
    // Check if user exists and password is correct
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [user, pass]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store login status in session
    res.clearCookie('username');
    res.clearCookie('role');
    res.cookie('username', rows[0].username, { maxAge });
    res.cookie('role', rows[0].role, { maxAge });
    req.session.user_id = rows[0].user_id;
    req.session.role = rows[0].role;

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving sessions' });
      }
      res.status(200).json({
        message: 'Login Successful',
        user: rows[0]
      });
    });
  } catch (err) {
    res.status(500).json({error: 'Login failed'});
  }
});

// // POST login (dummy version)
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const [rows] = await db.query(`
//       SELECT user_id, username, role FROM Users
//       WHERE email = ? AND password_hash = ?
//     `, [email, password]);

//     if (rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     res.json({ message: 'Login successful', user: rows[0] });
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed' });
//   }
// });

module.exports = router;
