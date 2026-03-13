const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    workoutName: {
      type: String,
      required: true,
      trim: true,
    },
    reminderDateTime: {
      type: Date,
      required: true,
      index: true, // Index for faster scheduler queries
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
      index: true,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    // Optional: Store additional workout details
    workoutDetails: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Index for efficient scheduler queries
reminderSchema.index({ reminderDateTime: 1, status: 1 });

// Method to mark reminder as sent
reminderSchema.methods.markAsSent = function () {
  this.status = 'sent';
  this.sentAt = new Date();
  return this.save();
};

// Method to mark reminder as failed
reminderSchema.methods.markAsFailed = function (errorMessage) {
  this.status = 'failed';
  this.errorMessage = errorMessage;
  return this.save();
};

// Static method to find pending reminders that should be sent
reminderSchema.statics.findPendingReminders = function () {
  const now = new Date();
  return this.find({
    status: 'pending',
    reminderDateTime: { $lte: now },
  }).sort({ reminderDateTime: 1 });
};

module.exports = mongoose.model('Reminder', reminderSchema);
