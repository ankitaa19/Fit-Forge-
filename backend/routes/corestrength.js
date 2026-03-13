const express = require('express');
const router = express.Router();
const CoreStrength = require('../models/CoreStrength');

// @route   GET /api/corestrength
// @desc    Get all core strength exercises
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { level, targetArea } = req.query;

    // Build filter
    const filter = {};
    if (level) filter.level = level;
    if (targetArea) filter.targetArea = targetArea;

    const exercises = await CoreStrength.find(filter).sort({ createdAt: 1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    console.error('Get core strength exercises error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching exercises'
    });
  }
});

// @route   GET /api/corestrength/:id
// @desc    Get single core strength exercise
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const exercise = await CoreStrength.findById(req.params.id);

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
    console.error('Get core strength exercise error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching exercise'
    });
  }
});

// @route   POST /api/corestrength
// @desc    Create a new core strength exercise
// @access  Public (should be protected in production)
router.post('/', async (req, res) => {
  try {
    const exercise = await CoreStrength.create(req.body);

    res.status(201).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Create core strength exercise error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating exercise'
    });
  }
});

// @route   DELETE /api/corestrength/:id
// @desc    Delete a core strength exercise
// @access  Public (should be protected in production)
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await CoreStrength.findByIdAndDelete(req.params.id);

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
    console.error('Delete core strength exercise error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting exercise'
    });
  }
});

module.exports = router;
