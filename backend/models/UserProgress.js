const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Stats
  totalWorkouts: {
    type: Number,
    default: 0
  },
  totalMinutes: {
    type: Number,
    default: 0
  },
  totalExercises: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastWorkoutDate: {
    type: Date,
    default: null
  },

  // Goal
  fitnessGoal: {
    type: String,
    enum: [
      'Weight Loss',
      'Muscle Gain',
      'General Fitness',
      'Endurance',
      'Flexibility & Mobility',
      'Core Strength'
    ],
    default: 'General Fitness',
    required: true
  },
  goalTarget: {
    type: Number,
    default: 100 // exercises to complete
  },

  // Goal-specific progress tracking
  // Tracks progress for each fitness goal separately
  goalProgress: {
    'Weight Loss': {
      workouts: { type: Number, default: 0 },
      exercises: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 }
    },
    'Muscle Gain': {
      workouts: { type: Number, default: 0 },
      exercises: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 }
    },
    'General Fitness': {
      workouts: { type: Number, default: 0 },
      exercises: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 }
    },
    'Endurance': {
      workouts: { type: Number, default: 0 },
      exercises: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 }
    },
    'Flexibility & Mobility': {
      workouts: { type: Number, default: 0 },
      exercises: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 }
    },
    'Core Strength': {
      workouts: { type: Number, default: 0 },
      exercises: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 }
    }
  },

  // Settings
  daysPerWeek: {
    type: Number,
    default: 4
  },
  minutesPerSession: {
    type: Number,
    default: 30
  },
  workoutReminders: {
    type: Boolean,
    default: false
  },

  // Monthly and weekly tracking
  monthlyStats: {
    workouts: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    exercises: { type: Number, default: 0 },
    month: { type: Number, default: new Date().getMonth() }
  },
  weeklyStats: {
    workouts: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    weekStart: { type: Date, default: null }
  },

  // Custom Workouts
  customWorkouts: [{
    name: { type: String, required: true },
    exercises: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now }
  }],

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update streak based on last workout date
userProgressSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!this.lastWorkoutDate) {
    this.currentStreak = 1;
  } else {
    const lastWorkout = new Date(this.lastWorkoutDate);
    lastWorkout.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, don't change streak
    } else if (diffDays === 1) {
      // Consecutive day
      this.currentStreak += 1;
    } else {
      // Streak broken
      this.currentStreak = 1;
    }
  }

  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }

  this.lastWorkoutDate = today;
};

// Reset monthly stats if new month
userProgressSchema.methods.checkMonthlyReset = function () {
  const currentMonth = new Date().getMonth();
  if (this.monthlyStats.month !== currentMonth) {
    this.monthlyStats = {
      workouts: 0,
      minutes: 0,
      exercises: 0,
      month: currentMonth
    };
  }
};

// Reset weekly stats if new week
userProgressSchema.methods.checkWeeklyReset = function () {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  if (!this.weeklyStats.weekStart || this.weeklyStats.weekStart < weekStart) {
    this.weeklyStats = {
      workouts: 0,
      minutes: 0,
      weekStart: weekStart
    };
  }
};

module.exports = mongoose.model('UserProgress', userProgressSchema);
