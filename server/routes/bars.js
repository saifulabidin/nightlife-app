const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Add user to bar
router.post('/:barId/attend', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const barId = req.params.barId;
    
    const barIndex = user.bars.findIndex(b => b.barId === barId);
    if (barIndex === -1) {
      user.bars.push({ barId, going: true });
    } else {
      user.bars[barIndex].going = true;
    }
    
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove user from bar
router.delete('/:barId/attend', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const barId = req.params.barId;
    
    const barIndex = user.bars.findIndex(b => b.barId === barId);
    if (barIndex !== -1) {
      user.bars[barIndex].going = false;
    }
    
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendees for a bar
router.get('/:barId/attendees', async (req, res) => {
  try {
    const barId = req.params.barId;
    const users = await User.find({ 'bars': { $elemMatch: { barId: barId, going: true } } });
    res.json({ 
      count: users.length,
      users: users.map(u => ({ id: u._id, username: u.username }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
