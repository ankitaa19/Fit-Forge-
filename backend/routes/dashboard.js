const express = require('express');
const router = express.Router();
const Dashboard = require('../models/Dashboard');

// GET all dashboard videos
router.get('/', async (req, res) => {
  try {
    const videos = await Dashboard.find();
    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Error fetching dashboard videos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard videos',
      error: error.message
    });
  }
});

module.exports = router;
