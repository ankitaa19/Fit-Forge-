const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  dayOfWeek: {
    type: String,
    required: true // Monday, Tuesday, etc.
  },
  meals: {
    breakfast: {
      name: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    lunch: {
      name: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    dinner: {
      name: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    snacks: [{
      name: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    }]
  },
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one diet plan per user per date
dietPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
