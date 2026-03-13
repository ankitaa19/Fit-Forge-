const express = require('express');
const router = express.Router();
const WeightLoss = require('../models/WeightLoss');

// Get all weight loss exercises
router.get('/', async (req, res) => {
  try {
    const { level } = req.query;

    let filter = {};

    if (level) {
      filter.level = level;
    }

    const exercises = await WeightLoss.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weight loss exercises',
      error: error.message
    });
  }
});

// Get single weight loss exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await WeightLoss.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.json({
      success: true,
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exercise',
      error: error.message
    });
  }
});

// Create new weight loss exercise (admin route)
router.post('/', async (req, res) => {
  try {
    const exercise = await WeightLoss.create(req.body);

    res.status(201).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating exercise',
      error: error.message
    });
  }
});

// Delete weight loss exercise
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await WeightLoss.findByIdAndDelete(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.json({
      success: true,
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting exercise',
      error: error.message
    });
  }
});

module.exports = router;
