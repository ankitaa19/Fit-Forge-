const mongoose = require('mongoose');

const dietCoreStrengthSchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 31
  },
  breakfast: {
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  midMorningSnack: {
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  lunch: {
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  eveningSnack: {
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  dinner: {
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  hydrationTip: {
    type: String,
    required: true
  },
  nutritionTip: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('DietCoreStrength', dietCoreStrengthSchema, 'dietcorestrength');
