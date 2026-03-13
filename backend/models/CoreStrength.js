const mongoose = require('mongoose');

const coreStrengthSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  videoUrls: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  durationSeconds: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  recommended: {
    type: Boolean,
    default: false
  },
  caloriesBurned: {
    type: Number,
    default: 7
  },
  targetArea: {
    type: String,
    enum: ['Upper Abs', 'Lower Abs', 'Obliques', 'Full Core', 'Lower Back'],
    required: true
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

module.exports = mongoose.model('CoreStrength', coreStrengthSchema, 'corestrength');
