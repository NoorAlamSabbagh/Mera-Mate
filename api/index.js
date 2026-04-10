const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/db');
const initDB = require('./utils/initDB');

dotenv.config();

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
      await initDB();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }
};

// Routes
app.use('/api/auth', async (req, res, next) => {
  await initialize();
  next();
}, require('./routes/authRoutes'));

app.use('/api/tasks', async (req, res, next) => {
  await initialize();
  next();
}, require('./routes/taskRoutes'));

// Root route
app.get('/api', async (req, res) => {
  await initialize();
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      console.log('Starting server for development...');
      await initDB();
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
