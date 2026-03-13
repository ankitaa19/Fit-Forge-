const mongoose = require('mongoose');
require('dotenv').config();
const Dashboard = require('../models/Dashboard');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

const dashboardVideos = [
  {
    title: 'Jumping Jacks',
    videoUrls: [
      'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
      'https://www.youtube.com/watch?v=iSSAk4XCsRA',
      'https://www.youtube.com/watch?v=UpH7rm0cYbM'
    ],
    description: 'Full-body cardio exercise that increases heart rate and burns calories',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    category: 'Cardio',
    recommended: true
  },
  {
    title: 'Bodyweight Squats',
    videoUrls: [
      'https://www.youtube.com/watch?v=aclHkVaku9U',
      'https://www.youtube.com/watch?v=YaXPRqUwItQ',
      'https://www.youtube.com/watch?v=gsNoPYwWXeM'
    ],
    description: 'Fundamental lower body exercise for building leg strength and power',
    durationSeconds: 60,
    duration: '60s',
    level: 'Beginner',
    category: 'Strength',
    recommended: true
  },
  {
    title: 'Mountain Climbers',
    videoUrls: [
      'https://www.youtube.com/watch?v=nmwgirgXLYM',
      'https://www.youtube.com/watch?v=cnyTQDSE884',
      'https://www.youtube.com/watch?v=wQq3ybaLlwI'
    ],
    description: 'Dynamic cardio exercise targeting core and total body conditioning',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    category: 'Cardio',
    recommended: true
  }
];

async function seedDashboard() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing dashboard videos
    await Dashboard.deleteMany({});
    console.log('🗑️  Cleared existing dashboard videos');

    // Insert new dashboard videos
    await Dashboard.insertMany(dashboardVideos);
    console.log(`✅ Successfully seeded ${dashboardVideos.length} dashboard videos`);

    // Close connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding dashboard:', error);
    process.exit(1);
  }
}

seedDashboard();
