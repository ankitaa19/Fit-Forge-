const express = require('express');
const router = express.Router();
const GeneralFitness = require('../models/GeneralFitness');

// GET all general fitness exercises
router.get('/', async (req, res) => {
  try {
    const { level, category } = req.query;
    let query = {};

    if (level) {
      query.level = level;
    }

    if (category) {
      query.category = category;
    }

    const exercises = await GeneralFitness.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    console.error('Error fetching general fitness exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// GET single general fitness exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await GeneralFitness.findById(req.params.id);

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
    console.error('Error fetching general fitness exercise:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// POST create new general fitness exercise
router.post('/', async (req, res) => {
  try {
    const exercise = await GeneralFitness.create(req.body);
    res.status(201).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Error creating general fitness exercise:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE general fitness exercise
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await GeneralFitness.findByIdAndDelete(req.params.id);

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
    console.error('Error deleting general fitness exercise:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;
