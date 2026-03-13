const mongoose = require('mongoose');
require('dotenv').config();
const MuscleGain = require('../models/MuscleGain');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

const muscleGainExercises = [
  {
    title: 'Push Ups',
    videoUrls: [
      'https://www.youtube.com/watch?v=IODxDxX7oi4',
      'https://www.youtube.com/watch?v=_l3ySVKYVJ8',
      'https://www.youtube.com/watch?v=Eh00_rniF8E'
    ],
    description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    caloriesBurned: 9,
    muscleGroup: 'Upper Body'
  },
  {
    title: 'Squats',
    videoUrls: [
      'https://www.youtube.com/watch?v=aclHkVaku9U',
      'https://www.youtube.com/watch?v=YaXPRqUwItQ',
      'https://www.youtube.com/watch?v=ultWZbUMPL8'
    ],
    description: 'Fundamental lower body exercise for quads, glutes, and hamstrings',
    level: 'Beginner',
    recommended: true,
    caloriesBurned: 10,
    muscleGroup: 'Lower Body'
  },
  {
    title: 'Lunges',
    videoUrls: [
      'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
      'https://www.youtube.com/watch?v=wrwwXE_x-pQ',
      'https://www.youtube.com/watch?v=COKYKgQ8KR0'
    ],
    description: 'Unilateral leg exercise for balance, strength, and muscle development',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    caloriesBurned: 9,
    muscleGroup: 'Lower Body'
  },
  {
    title: 'Glute Bridge',
    videoUrls: [
      'https://www.youtube.com/watch?v=wPM8icPu6H8',
      'https://www.youtube.com/watch?v=m2Zx-57cSok'
    ],
    description: 'Posterior chain exercise targeting glutes and hamstrings',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    caloriesBurned: 9,
    muscleGroup: 'Lower Body'
  },
  {
    title: 'Wall Sit',
    videoUrls: [
      'https://www.youtube.com/watch?v=y-wV4Venusw',
      'https://www.youtube.com/watch?v=MMV3v4apj9U'
    ],
    description: 'Isometric exercise for quad endurance and strength',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: false,
    caloriesBurned: 8,
    muscleGroup: 'Lower Body'
  },
  {
    title: 'Chair Dips',
    videoUrls: [
      'https://www.youtube.com/watch?v=6kALZikXxLc',
      'https://www.youtube.com/watch?v=tKjcgfu44sI'
    ],
    description: 'Bodyweight exercise for triceps and chest development',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: true,
    caloriesBurned: 9,
    muscleGroup: 'Upper Body'
  },
  {
    title: 'Bulgarian Split Squats',
    videoUrls: [
      'https://www.youtube.com/watch?v=2C-uNgKwPLE',
      'https://www.youtube.com/watch?v=qNXz6R0KpKQ'
    ],
    description: 'Advanced single-leg exercise for quad and glute hypertrophy',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: true,
    caloriesBurned: 10,
    muscleGroup: 'Lower Body'
  },
  {
    title: 'Pike Push Ups',
    videoUrls: [
      'https://www.youtube.com/watch?v=qHQ_E-f5278',
      'https://www.youtube.com/watch?v=srprqb9sKzg'
    ],
    description: 'Shoulder-focused push-up variation for deltoid development',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: true,
    caloriesBurned: 9,
    muscleGroup: 'Upper Body'
  },
  {
    title: 'Decline Push Ups',
    videoUrls: [
      'https://www.youtube.com/watch?v=I7ovLvP_cR4', // Fixed: replaced invalid URL
      'https://www.youtube.com/watch?v=L-Yd2YpIDkI'
    ],
    description: 'Progressive push-up variation targeting upper chest',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: false,
    caloriesBurned: 10,
    muscleGroup: 'Upper Body'
  },
  {
    title: 'Pistol Squats',
    videoUrls: [
      'https://www.youtube.com/watch?v=vq5-vdgJc0I',
      'https://www.youtube.com/watch?v=2z8JmcrW-As'
    ],
    description: 'Advanced single-leg squat for strength and balance',
    durationSeconds: 60,
    duration: '1 min',
    level: 'Advanced',
    recommended: false,
    caloriesBurned: 11,
    muscleGroup: 'Lower Body'
  },
  {
    title: 'Reverse Lunges',
    videoUrls: [
      'https://www.youtube.com/watch?v=wrwwXE_x-pQ',
      'https://www.youtube.com/watch?v=MxfTNXSFiYI'
    ],
    description: 'Knee-friendly lunge variation for leg development',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    caloriesBurned: 9,
    muscleGroup: 'Lower Body'
  },
  {
    title: 'Hip Thrusts',
    videoUrls: [
      'https://www.youtube.com/watch?v=LM8XHLYJoYs',
      'https://www.youtube.com/watch?v=SEdqd1n0cvg'
    ],
    description: 'Premier glute-building exercise for hip extension strength',
    durationSeconds: 60,
    duration: '1 min',
    level: 'Intermediate',
    recommended: true,
    caloriesBurned: 10,
    muscleGroup: 'Lower Body'
  },
  {
    title: 'Step Ups with Knee Drive',
    videoUrls: [
      'https://www.youtube.com/watch?v=dQqApCGd5Ss',
      'https://www.youtube.com/watch?v=wc8tQh4uCkg'
    ],
    description: 'Dynamic leg exercise combining strength and power',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: false,
    caloriesBurned: 10,
    muscleGroup: 'Lower Body'
  },
  {
    title: 'Calf Raises',
    videoUrls: [
      'https://www.youtube.com/watch?v=-M4-G8p8fmc',
      'https://www.youtube.com/watch?v=YMmgqO8Jo-k'
    ],
    description: 'Isolation exercise for calf muscle development',
    durationSeconds: 60,
    duration: '1 min',
    level: 'Beginner',
    recommended: false,
    caloriesBurned: 7,
    muscleGroup: 'Lower Body'
  },
  {
    title: 'Isometric Hold Squats',
    videoUrls: [
      'https://www.youtube.com/watch?v=aclHkVaku9U',
      'https://www.youtube.com/watch?v=YaXPRqUwItQ'
    ],
    description: 'Static squat hold for building muscular endurance',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: false,
    caloriesBurned: 8,
    muscleGroup: 'Lower Body'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing muscle gain exercises
    await MuscleGain.deleteMany({});
    console.log('🗑️  Cleared existing muscle gain exercises');

    // Insert muscle gain exercises
    const result = await MuscleGain.insertMany(muscleGainExercises);
    console.log(`✅ Successfully seeded ${result.length} muscle gain exercises`);

    // Display summary
    console.log('\n📊 Seeded exercises in "musclegain" collection:');
    result.forEach((exercise, index) => {
      console.log(`${index + 1}. ${exercise.title} - ${exercise.videoUrls.length} video(s) - ${exercise.muscleGroup}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
