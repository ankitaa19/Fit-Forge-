const express = require('express');
const router = express.Router();
const Endurance = require('../models/Endurance');

// GET all endurance exercises
router.get('/', async (req, res) => {
  try {
    const { level, exerciseType } = req.query;
    let query = {};

    if (level) {
      query.level = level;
    }

    if (exerciseType) {
      query.exerciseType = exerciseType;
    }

    const exercises = await Endurance.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    console.error('Error fetching endurance exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// GET single endurance exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Endurance.findById(req.params.id);

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
    console.error('Error fetching endurance exercise:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// POST create new endurance exercise
router.post('/', async (req, res) => {
  try {
    const exercise = await Endurance.create(req.body);
    res.status(201).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Error creating endurance exercise:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE endurance exercise
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await Endurance.findByIdAndDelete(req.params.id);

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
    console.error('Error deleting endurance exercise:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;
