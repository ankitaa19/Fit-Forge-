const express = require('express');
const router = express.Router();
const FlexibilityMobility = require('../models/FlexibilityMobility');

// GET all flexibility & mobility exercises
router.get('/', async (req, res) => {
  try {
    const { level, focusArea } = req.query;
    let query = {};

    if (level) {
      query.level = level;
    }

    if (focusArea) {
      query.focusArea = focusArea;
    }

    const exercises = await FlexibilityMobility.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    console.error('Error fetching flexibility & mobility exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// GET single flexibility & mobility exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await FlexibilityMobility.findById(req.params.id);

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
    console.error('Error fetching flexibility & mobility exercise:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// POST create new flexibility & mobility exercise
router.post('/', async (req, res) => {
  try {
    const exercise = await FlexibilityMobility.create(req.body);
    res.status(201).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Error creating flexibility & mobility exercise:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE flexibility & mobility exercise
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await FlexibilityMobility.findByIdAndDelete(req.params.id);

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
    console.error('Error deleting flexibility & mobility exercise:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;
