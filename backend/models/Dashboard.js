const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrls: { type: [String], required: true },
  description: { type: String, required: true },
  durationSeconds: { type: Number, required: true },
  duration: { type: String, required: true },
  level: { type: String, required: true },
  category: { type: String, required: true },
  recommended: { type: Boolean, default: true }
});

module.exports = mongoose.model('Dashboard', dashboardSchema);
