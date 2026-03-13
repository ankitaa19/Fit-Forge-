const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');

// @route   GET /api/progress/:userId
// @desc    Get user progress
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.params.userId });

    // If no progress exists, create initial progress
    if (!progress) {
      progress = await UserProgress.create({ userId: req.params.userId, fitnessGoal: 'General Fitness' });
    }

    // Check and reset monthly/weekly stats if needed
    progress.checkMonthlyReset();
    progress.checkWeeklyReset();
    await progress.save();

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching progress'
    });
  }
});

// @route   POST /api/progress/:userId/workout
// @desc    Log a workout session
// @access  Private
router.post('/:userId/workout', auth, async (req, res) => {
  try {
    const { seconds, exercisesCompleted } = req.body;
    const minutes = Math.round(seconds / 60); // Convert seconds to minutes for storage

    let progress = await UserProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      progress = await UserProgress.create({ userId: req.params.userId, fitnessGoal: 'General Fitness' });
    }

    // Check and reset stats if needed
    progress.checkMonthlyReset();
    progress.checkWeeklyReset();

    // Update overall stats
    progress.totalWorkouts += 1;
    progress.totalMinutes += minutes;
    progress.totalExercises += exercisesCompleted;

    // Update goal-specific progress for current goal
    const currentGoal = progress.fitnessGoal;
    if (!progress.goalProgress) {
      progress.goalProgress = {};
    }
    if (!progress.goalProgress[currentGoal]) {
      progress.goalProgress[currentGoal] = { workouts: 0, exercises: 0, minutes: 0 };
    }
    progress.goalProgress[currentGoal].workouts += 1;
    progress.goalProgress[currentGoal].exercises += exercisesCompleted;
    progress.goalProgress[currentGoal].minutes += minutes;

    // Update monthly stats
    progress.monthlyStats.workouts += 1;
    progress.monthlyStats.minutes += minutes;
    progress.monthlyStats.exercises += exercisesCompleted;

    // Update weekly stats
    progress.weeklyStats.workouts += 1;
    progress.weeklyStats.minutes += minutes;

    // Update streak
    progress.updateStreak();

    progress.updatedAt = Date.now();
    await progress.save();

    res.json({
      success: true,
      message: 'Workout logged successfully',
      data: progress
    });
  } catch (error) {
    console.error('Log workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error logging workout'
    });
  }
});

// @route   PUT /api/progress/:userId/settings
// @desc    Update user fitness settings
// @access  Private
router.put('/:userId/settings', auth, async (req, res) => {
  try {
    const { fitnessGoal, daysPerWeek, minutesPerSession, workoutReminders } = req.body;

    let progress = await UserProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      progress = await UserProgress.create({
        userId: req.params.userId,
        fitnessGoal: fitnessGoal || 'General Fitness'
      });
    }

    // Update settings
    if (fitnessGoal) progress.fitnessGoal = fitnessGoal;
    if (daysPerWeek) progress.daysPerWeek = daysPerWeek;
    if (minutesPerSession) progress.minutesPerSession = minutesPerSession;
    if (workoutReminders !== undefined) progress.workoutReminders = workoutReminders;

    progress.updatedAt = Date.now();
    await progress.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: progress
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating settings'
    });
  }
});

// @route   GET /api/progress/:userId/goal-progress
// @desc    Get progress for all fitness goals
// @access  Private
router.get('/:userId/goal-progress', auth, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      progress = await UserProgress.create({ userId: req.params.userId, fitnessGoal: 'General Fitness' });
    }

    res.json({
      success: true,
      data: {
        currentGoal: progress.fitnessGoal,
        goalProgress: progress.goalProgress || {},
        totalProgress: {
          workouts: progress.totalWorkouts,
          exercises: progress.totalExercises,
          minutes: progress.totalMinutes
        }
      }
    });
  } catch (error) {
    console.error('Get goal progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching goal progress'
    });
  }
});

// @route   POST /api/progress/:userId/custom-workouts
// @desc    Save a custom workout
// @access  Private
router.post('/:userId/custom-workouts', auth, async (req, res) => {
  try {
    const { name, exercises } = req.body;

    if (!exercises || exercises.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one exercise'
      });
    }

    let progress = await UserProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      progress = await UserProgress.create({ userId: req.params.userId, fitnessGoal: 'General Fitness' });
    }

    // Add new workout
    progress.customWorkouts.push({
      name: name || `Workout ${progress.customWorkouts.length + 1}`,
      exercises: exercises,
      createdAt: new Date()
    });

    progress.updatedAt = Date.now();
    await progress.save();

    res.json({
      success: true,
      message: 'Workout saved successfully',
      data: progress.customWorkouts
    });
  } catch (error) {
    console.error('Save custom workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving workout'
    });
  }
});

// @route   GET /api/progress/:userId/custom-workouts
// @desc    Get user's custom workouts
// @access  Private
router.get('/:userId/custom-workouts', auth, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      return res.json({
        success: true,
        data: []
      });
    }

    res.json({
      success: true,
      data: progress.customWorkouts || []
    });
  } catch (error) {
    console.error('Get custom workouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching workouts'
    });
  }
});

// @route   DELETE /api/progress/:userId/custom-workouts/:workoutId
// @desc    Delete a custom workout
// @access  Private
router.delete('/:userId/custom-workouts/:workoutId', auth, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'User progress not found'
      });
    }

    // Remove workout by _id
    progress.customWorkouts = progress.customWorkouts.filter(
      w => w._id.toString() !== req.params.workoutId
    );

    progress.updatedAt = Date.now();
    await progress.save();

    res.json({
      success: true,
      message: 'Workout deleted successfully',
      data: progress.customWorkouts
    });
  } catch (error) {
    console.error('Delete custom workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting workout'
    });
  }
});

module.exports = router;
