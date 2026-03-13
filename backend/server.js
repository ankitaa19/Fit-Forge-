const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const weightLossRoutes = require('./routes/weightloss');
const muscleGainRoutes = require('./routes/musclegain');
const coreStrengthRoutes = require('./routes/corestrength');
const flexibilityMobilityRoutes = require('./routes/flexibilitymobility');
const enduranceRoutes = require('./routes/endurance');
const generalFitnessRoutes = require('./routes/generalfitness');
const dashboardRoutes = require('./routes/dashboard');
const dietRoutes = require('./routes/diet');
const dietCyclicalRoutes = require('./routes/dietCyclical');
const reminderRoutes = require('./routes/reminders');
const reminderScheduler = require('./services/reminderScheduler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/weightloss', weightLossRoutes);
app.use('/api/musclegain', muscleGainRoutes);
app.use('/api/corestrength', coreStrengthRoutes);
app.use('/api/flexibilitymobility', flexibilityMobilityRoutes);
app.use('/api/endurance', enduranceRoutes);
app.use('/api/generalfitness', generalFitnessRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/diet-cyclical', dietCyclicalRoutes); // New 31-day cyclical diet system
app.use('/api/reminders', reminderRoutes); // Workout reminder routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FitForge API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// MongoDB Connection
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Start the reminder scheduler
    reminderScheduler.start();
    console.log('⏰ Reminder scheduler started');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
