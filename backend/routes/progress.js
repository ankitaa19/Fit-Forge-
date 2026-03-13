const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const toInt = (value) => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return Math.round(value);
  }
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const buildWeekSeries = (total, daysFilled) => {
  const safeTotal = Math.max(0, toInt(total));
  const safeDays = Math.min(Math.max(toInt(daysFilled), 0), 7);
  const avg = Math.floor(safeTotal / 7);
  const remainder = safeTotal % 7;
  const series = {};

  DAY_LABELS.forEach((day, index) => {
    if (index < safeDays) {
      series[day] = avg + (index === safeDays - 1 ? remainder : 0);
    } else {
      series[day] = 0;
    }
  });

  return series;
};

const buildMonthlyOverview = (exercisesTotal, minutesTotal, weeksToShow) => {
  const safeWeeks = Math.max(toInt(weeksToShow), 1);
  const safeExercises = Math.max(0, toInt(exercisesTotal));
  const safeMinutes = Math.max(0, toInt(minutesTotal));
  const exercisesBase = Math.floor(safeExercises / safeWeeks);
  const minutesBase = Math.floor(safeMinutes / safeWeeks);
  const exercisesRemainder = safeExercises % safeWeeks;
  const minutesRemainder = safeMinutes % safeWeeks;
  const overview = {};

  for (let i = 1; i <= 4; i += 1) {
    overview[`Week ${i}`] = {
      exercises: exercisesBase + (i <= exercisesRemainder ? 1 : 0),
      minutes: minutesBase + (i <= minutesRemainder ? 1 : 0)
    };
  }

  return overview;
};

const buildChartData = (progress) => {
  const currentGoal = progress.fitnessGoal || 'General Fitness';
  const goalProgress =
    progress.goalProgress && progress.goalProgress[currentGoal]
      ? progress.goalProgress[currentGoal]
      : null;

  const overallExercises = toInt(progress.totalExercises);
  const overallMinutes = toInt(progress.totalMinutes);
  const overallWorkouts = toInt(progress.totalWorkouts);

  const goalExercises = goalProgress ? toInt(goalProgress.exercises) : overallExercises;
  const goalMinutes = goalProgress ? toInt(goalProgress.minutes) : overallMinutes;
  const goalWorkouts = goalProgress ? toInt(goalProgress.workouts) : overallWorkouts;

  const exercisesRatio =
    overallExercises > 0 ? goalExercises / overallExercises : 1;
  const minutesRatio =
    overallMinutes > 0 ? goalMinutes / overallMinutes : 1;
  const workoutsRatio =
    overallWorkouts > 0 ? goalWorkouts / overallWorkouts : 1;

  const weeklyWorkouts = Math.round(
    toInt(progress.weeklyStats?.workouts) * workoutsRatio
  );
  const weeklyMinutes = Math.round(
    toInt(progress.weeklyStats?.minutes) * minutesRatio
  );
  const monthlyExercises = Math.round(
    toInt(progress.monthlyStats?.exercises) * exercisesRatio
  );
  const monthlyMinutes = Math.round(
    toInt(progress.monthlyStats?.minutes) * minutesRatio
  );

  const exercisesPerWorkout =
    goalWorkouts > 0 ? goalExercises / goalWorkouts : 0;
  const weeklyExercises = weeklyWorkouts > 0
    ? Math.round(weeklyWorkouts * exercisesPerWorkout)
    : (goalExercises > 0 ? Math.round(goalExercises / 4) : 0);

  const todayIndex = (new Date().getDay() + 6) % 7;
  const daysThisWeek = todayIndex + 1;

  const weeklyExercisesLastWeek = Math.floor(weeklyExercises * 0.7);
  const weeklyExercisesLast4Weeks = monthlyExercises > 0
    ? Math.floor(monthlyExercises / 4)
    : weeklyExercises;

  const weeklyMinutesLastWeek = Math.floor(weeklyMinutes * 0.7);
  const weeklyMinutesLast30Days = monthlyMinutes > 0
    ? Math.floor(monthlyMinutes / 4)
    : weeklyMinutes;

  return {
    weeklyExercises: {
      thisWeek: buildWeekSeries(weeklyExercises, daysThisWeek),
      lastWeek: buildWeekSeries(weeklyExercisesLastWeek, 7),
      last4Weeks: buildWeekSeries(weeklyExercisesLast4Weeks, 7)
    },
    weeklyMinutes: {
      thisWeek: buildWeekSeries(weeklyMinutes, daysThisWeek),
      lastWeek: buildWeekSeries(weeklyMinutesLastWeek, 7),
      last30Days: buildWeekSeries(weeklyMinutesLast30Days, 7)
    },
    monthlyOverview: {
      currentMonth: buildMonthlyOverview(monthlyExercises, monthlyMinutes, 4),
      last3Months: buildMonthlyOverview(
        Math.floor(monthlyExercises * 1.2),
        Math.floor(monthlyMinutes * 1.2),
        12
      ),
      last6Months: buildMonthlyOverview(
        Math.floor(monthlyExercises * 1.5),
        Math.floor(monthlyMinutes * 1.5),
        24
      ),
      last12Months: buildMonthlyOverview(
        Math.floor(monthlyExercises * 2),
        Math.floor(monthlyMinutes * 2),
        52
      )
    }
  };
};

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

    const progressData = progress.toObject();
    progressData.chartData = buildChartData(progress);

    res.json({
      success: true,
      data: progressData
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
