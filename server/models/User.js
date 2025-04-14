const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    index: true, // Add index for better query performance
    trim: true   // Remove whitespace
  },
  password: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    trim: true
  },
  bars: [{
    barId: String,
    going: Boolean
  }]
});

// Add error handling middleware
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Username already exists'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
