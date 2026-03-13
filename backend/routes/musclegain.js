const express = require('express');
const router = express.Router();
const MuscleGain = require('../models/MuscleGain');

// Get all muscle gain exercises
router.get('/', async (req, res) => {
  try {
    const { level, muscleGroup } = req.query;

    let filter = {};

    if (level) {
      filter.level = level;
    }

    if (muscleGroup) {
      filter.muscleGroup = muscleGroup;
    }

    const exercises = await MuscleGain.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching muscle gain exercises',
      error: error.message
    });
  }
});

// Get single muscle gain exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await MuscleGain.findById(req.params.id);

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

// Create new muscle gain exercise (admin route)
router.post('/', async (req, res) => {
  try {
    const exercise = await MuscleGain.create(req.body);

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

// Delete muscle gain exercise
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await MuscleGain.findByIdAndDelete(req.params.id);

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
