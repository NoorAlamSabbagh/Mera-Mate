const express = require('express');
const cors = require('cors');
const path = require('path');
// Explicitly load .env from root
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { pool } = require('./config/db');
const initDB = require('./utils/initDB');

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Initialize database once (in serverless, this runs on cold start)
let dbInitialized = false;
const initialize = async () => {
  if (!dbInitialized) {
    try {
      console.log('Running database initialization...');
      await initDB();
      dbInitialized = true;
      console.log('Database initialization successful');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error; // Rethrow so the middleware can catch it and return 500
    }
  }
};

// Routes
app.use('/api/auth', async (req, res, next) => {
  try {
    await initialize();
    next();
  } catch (error) {
    next(error); // Pass to error handler
  }
}, require('./routes/authRoutes'));

app.use('/api/tasks', async (req, res, next) => {
  try {
    await initialize();
    next();
  } catch (error) {
    next(error); // Pass to error handler
  }
}, require('./routes/taskRoutes'));

// Root route
app.get('/api', async (req, res, next) => {
  try {
    await initialize();
    res.send('API is running...');
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV !== 'production' ? {
      message: err.message,
      stack: err.stack,
      hint: 'Please check your DATABASE_URL in .env'
    } : {}
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      console.log('Starting server for development...');
      await initialize(); // Use the shared initialize function
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
    }
  };
  startServer();
}

// For Vercel, we export the app
module.exports = app;
