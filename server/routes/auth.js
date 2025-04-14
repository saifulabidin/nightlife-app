const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const user = await User.create({ username, email, password });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SESSION_SECRET,
      { expiresIn: '7d' }
    );
    
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ success: true, user: { id: user._id, username: user.username } });
  } catch (error) {
    if (error.message.includes('Username already exists')) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.SESSION_SECRET,
        { expiresIn: '7d' }
      );
      
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({ success: true, user: { id: user._id, username: user.username } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ success: true });
});

router.get('/user', (req, res) => {
  if (req.user) {
    res.json({ id: req.user.id, username: req.user.username });
  } else {
    res.json(null);
  }
});

module.exports = router;
