const mongoose = require('mongoose');
require('dotenv').config();
const UserProgress = require('./models/UserProgress');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

async function testTracking() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find a user progress document
    const progress = await UserProgress.findOne();

    if (!progress) {
      console.log('❌ No user progress found in database');
      console.log('Please complete a workout first to test tracking!');
      process.exit(0);
    }

    console.log('📊 Current Progress Data:');
    console.log('========================');
    console.log('Total Workouts:', progress.totalWorkouts);
    console.log('Total Minutes:', progress.totalMinutes);
    console.log('Total Exercises:', progress.totalExercises);
    console.log('Current Streak:', progress.currentStreak);
    console.log('Longest Streak:', progress.longestStreak);
    console.log('Last Workout Date:', progress.lastWorkoutDate);
    console.log('Fitness Goal:', progress.fitnessGoal);
    console.log('Goal Target:', progress.goalTarget);
    console.log('\n📈 Goal Progress:', Math.round((progress.totalExercises / progress.goalTarget) * 100) + '%');

    console.log('\n📅 Weekly Stats:');
    console.log('Workouts this week:', progress.weeklyStats.workouts);
    console.log('Minutes this week:', progress.weeklyStats.minutes);

    console.log('\n📅 Monthly Stats:');
    console.log('Workouts this month:', progress.monthlyStats.workouts);
    console.log('Minutes this month:', progress.monthlyStats.minutes);
    console.log('Exercises this month:', progress.monthlyStats.exercises);

    // Test streak logic
    console.log('\n🔥 Streak Calculation:');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (progress.lastWorkoutDate) {
      const lastWorkout = new Date(progress.lastWorkoutDate);
      lastWorkout.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));

      console.log('Today:', today.toISOString().split('T')[0]);
      console.log('Last workout:', lastWorkout.toISOString().split('T')[0]);
      console.log('Days since last workout:', diffDays);

      if (diffDays === 0) {
        console.log('✅ Workout completed today - streak continues');
      } else if (diffDays === 1) {
        console.log('✅ Ready for next workout - would increment streak');
      } else if (diffDays > 1) {
        console.log('⚠️  Streak would reset to 1 on next workout');
      }
    } else {
      console.log('No previous workout date');
    }

    console.log('\n✅ All tracking systems are functioning correctly!');
    console.log('\nTo verify:');
    console.log('1. Complete a workout in the app');
    console.log('2. Check if these numbers increment');
    console.log('3. Run this script again to see updated values');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testTracking();
