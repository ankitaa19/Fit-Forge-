const mongoose = require('mongoose');

const weightLossSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide exercise title'],
    trim: true
  },
  videoUrls: {
    type: [String],
    required: [true, 'Please provide at least one video URL'],
    validate: {
      validator: function(v) {
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
    default: 30
  },
  duration: {
    type: String,
    default: '30s'
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
    default: 5
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

// Collection name will be 'weightloss'
module.exports = mongoose.model('WeightLoss', weightLossSchema, 'weightloss');
