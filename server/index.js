require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const authRoutes = require('./routes/auth');
const barRoutes = require('./routes/bars');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/nightlife-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Configure static file serving before other middleware
app.use(express.static('public', {
  extensions: ['html', 'htm', 'ico', 'png'],
  index: 'index.html'
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'nightlife-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// JWT Authentication middleware
app.use((req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET);
      req.user = decoded;
    } catch (err) {
      // Invalid token - clear it
      res.clearCookie('jwt');
    }
  }
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/bars', barRoutes);

// Search venues using Foursquare API
app.get('/api/venues/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Location query is required' });
    }

    const url = `https://api.foursquare.com/v3/places/search?query=bar&near=${query}&limit=10`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': process.env.FOURSQUARE_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Foursquare API request failed');
    }

    const data = await response.json();
    
    if (!data.results) {
      return res.status(404).json({ error: 'No venues found' });
    }

    const venues = data.results.map(venue => ({
      id: venue.fsq_id,
      name: venue.name,
      category: venue.categories?.[0]?.name || 'Bar',
      address: venue.location?.formatted_address || 'Address not available',
      distance: venue.distance ? `${(venue.distance/1000).toFixed(1)} km` : 'Distance unknown',
      coordinates: venue.geocodes?.main || null
    }));

    res.json(venues);
  } catch (error) {
    console.error('Foursquare API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch venues',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});