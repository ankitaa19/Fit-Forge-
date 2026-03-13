const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const auth = require('../middleware/auth');

// @route   POST /api/reminders
// @desc    Create a new workout reminder
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { userEmail, workoutName, reminderDateTime, workoutDetails } = req.body;

    // Validation
    if (!userEmail || !workoutName || !reminderDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userEmail, workoutName, and reminderDateTime',
      });
    }

    // Validate that reminder time is in the future
    const reminderDate = new Date(reminderDateTime);
    const now = new Date();

    if (reminderDate <= now) {
      return res.status(400).json({
        success: false,
        message: 'Reminder time must be in the future',
      });
    }

    // Create reminder
    const reminder = await Reminder.create({
      userId: req.user.id,
      userEmail: userEmail.toLowerCase().trim(),
      workoutName: workoutName.trim(),
      reminderDateTime: reminderDate,
      workoutDetails: workoutDetails || null,
    });

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: {
        id: reminder._id,
        workoutName: reminder.workoutName,
        reminderDateTime: reminder.reminderDateTime,
        status: reminder.status,
      },
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating reminder',
      error: error.message,
    });
  }
});

// @route   GET /api/reminders
// @desc    Get all reminders for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id })
      .sort({ reminderDateTime: 1 })
      .select('-__v');

    res.json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reminders',
    });
  }
});

// @route   GET /api/reminders/:id
// @desc    Get a single reminder by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    res.json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    console.error('Get reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reminder',
    });
  }
});

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    res.json({
      success: true,
      message: 'Reminder deleted successfully',
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting reminder',
    });
  }
});

// @route   PUT /api/reminders/:id
// @desc    Update a reminder
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { workoutName, reminderDateTime, workoutDetails } = req.body;

    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    // Only allow updating pending reminders
    if (reminder.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a reminder that has already been sent',
      });
    }

    // Validate new reminder time is in the future
    if (reminderDateTime) {
      const newReminderDate = new Date(reminderDateTime);
      if (newReminderDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Reminder time must be in the future',
        });
      }
      reminder.reminderDateTime = newReminderDate;
    }

    if (workoutName) reminder.workoutName = workoutName.trim();
    if (workoutDetails !== undefined) reminder.workoutDetails = workoutDetails;

    await reminder.save();

    res.json({
      success: true,
      message: 'Reminder updated successfully',
      data: reminder,
    });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating reminder',
    });
  }
});

module.exports = router;
