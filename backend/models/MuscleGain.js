const mongoose = require('mongoose');

const muscleGainSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide exercise title'],
    trim: true
  },
  videoUrls: {
    type: [String],
    required: [true, 'Please provide at least one video URL'],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'Exercise must have at least one video URL'
    }
  },
  description: {
    type: String,
    default: ''
  },
  durationSeconds: {
    type: Number,
    default: 60
  },
  duration: {
    type: String,
    default: '60s'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  recommended: {
    type: Boolean,
    default: false
  },
  caloriesBurned: {
    type: Number,
    default: 8
  },
  muscleGroup: {
    type: String,
    enum: ['Upper Body', 'Lower Body', 'Core', 'Full Body'],
    default: 'Full Body'
  },
  what: {
    type: String,
    default: ''
  },
  why: {
    type: String,
    default: ''
  },
  how: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Collection name will be 'musclegain'
module.exports = mongoose.model('MuscleGain', muscleGainSchema, 'musclegain');
