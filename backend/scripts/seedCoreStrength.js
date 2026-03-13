const mongoose = require('mongoose');
require('dotenv').config();
const CoreStrength = require('../models/CoreStrength');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

const coreStrengthExercises = [
  {
    title: 'Plank',
    videoUrls: [
      'https://www.youtube.com/watch?v=pSHjTRCQxIw',
      'https://www.youtube.com/watch?v=ASdvN_XEl_c',
      'https://www.youtube.com/watch?v=B296mZDhrP4'
    ],
    description: 'Isometric core exercise that builds strength and stability',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    targetArea: 'Full Core',
  caloriesBurned: 7
  },
  {
    title: 'Leg Raises',
    videoUrls: [
      'https://www.youtube.com/watch?v=l4kQd9eWclE',
      'https://www.youtube.com/watch?v=JB2oyawG9KI'
    ],
    description: 'Lower abdominal exercise for core strength',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: true,
    targetArea: 'Lower Abs',
  caloriesBurned: 7
  },
  {
    title: 'Russian Twists',
    videoUrls: [
      'https://www.youtube.com/watch?v=wkD8rjkodUI',
      'https://www.youtube.com/watch?v=DJQGX2J4IVw'
    ],
    description: 'Rotational core exercise targeting obliques',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: true,
    targetArea: 'Obliques',
  caloriesBurned: 7
  },
  {
    title: 'Bicycle Crunch',
    videoUrls: [
      'https://www.youtube.com/watch?v=9FGilxCbdz8',
      'https://www.youtube.com/watch?v=1we3bh9uhqY'
    ],
    description: 'Dynamic ab exercise engaging both upper and lower abs',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    targetArea: 'Full Core',
  caloriesBurned: 7
  },
  {
    title: 'Mountain Climbers',
    videoUrls: [
      'https://www.youtube.com/watch?v=nmwgirgXLYM',
      'https://www.youtube.com/watch?v=cnyTQDSE884'
    ],
    description: 'Dynamic core exercise with cardio benefits',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: true,
    targetArea: 'Full Core',
  caloriesBurned: 7
  },
  {
    title: 'Flutter Kicks',
    videoUrls: [
      'https://www.youtube.com/watch?v=1V7wFvJ0dzk',
      'https://www.youtube.com/watch?v=QScbqg4sR7U'
    ],
    description: 'Lower ab exercise with controlled leg movements',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: false,
    targetArea: 'Lower Abs',
  caloriesBurned: 7
  },
  {
    title: 'Side Plank',
    videoUrls: [
      'https://www.youtube.com/watch?v=K2VljzCC16g',
      'https://www.youtube.com/watch?v=ynUw0YsrmSg'
    ],
    description: 'Lateral plank variation targeting obliques',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: true,
    targetArea: 'Obliques',
  caloriesBurned: 7
  },
  {
    title: 'Toe Touches',
    videoUrls: [
      'https://www.youtube.com/watch?v=Jg61m0DwURs'
    ],
    description: 'Upper ab exercise with vertical leg reaches',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: false,
    targetArea: 'Upper Abs',
  caloriesBurned: 7
  },
  {
    title: 'Dead Bug Exercise',
    videoUrls: [
      'https://www.youtube.com/watch?v=4XLEnwUr1d8',
      'https://www.youtube.com/watch?v=g_BYB0R-4Ws'
    ],
    description: 'Core stability exercise with coordinated limb movements',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    targetArea: 'Full Core',
  caloriesBurned: 7
  },
  {
    title: 'Reverse Crunch',
    videoUrls: [
      'https://www.youtube.com/watch?v=hyv14e2QDq0'
    ],
    description: 'Lower ab focused crunch variation',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: false,
    targetArea: 'Lower Abs',
  caloriesBurned: 7
  },
  {
    title: 'V-Ups',
    videoUrls: [
      'https://www.youtube.com/watch?v=iP2fjvG0g3w'
    ],
    description: 'Advanced full core exercise requiring coordination',
    durationSeconds: 30,
    duration: '30s',
    level: 'Advanced',
    recommended: true,
    targetArea: 'Full Core',
  caloriesBurned: 7
  },
  {
    title: 'Hollow Body Hold',
    videoUrls: [
      'https://www.youtube.com/watch?v=LlDNef_Ztsc'
    ],
    description: 'Isometric hold for total core engagement',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: false,
    targetArea: 'Full Core',
  caloriesBurned: 7
  },
  {
    title: 'Heel Taps',
    videoUrls: [
      'https://www.youtube.com/watch?v=0hWJz8aR4hY'
    ],
    description: 'Oblique-focused exercise with lateral movements',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: false,
    targetArea: 'Obliques',
  caloriesBurned: 7
  },
  {
    title: 'Bird Dog',
    videoUrls: [
      'https://www.youtube.com/watch?v=wiFNA3sqjCA',
      'https://www.youtube.com/watch?v=vj2w851ZHRM'
    ],
    description: 'Core stability exercise with back extension benefits',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    targetArea: 'Lower Back',
  caloriesBurned: 7
  },
  {
    title: 'Plank Shoulder Taps',
    videoUrls: [
      'https://www.youtube.com/watch?v=LSI9J0H4nqk',
      'https://www.youtube.com/watch?v=6uQn1XgU2t0'
    ],
    description: 'Dynamic plank variation for anti-rotation strength',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: true,
    targetArea: 'Full Core',
  caloriesBurned: 7
  }
];

async function seedCoreStrength() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected...');

    // Clear existing core strength exercises
    await CoreStrength.deleteMany({});
    console.log('Cleared existing core strength exercises');

    // Insert new exercises
    const result = await CoreStrength.insertMany(coreStrengthExercises);
    console.log(`✅ Successfully seeded ${result.length} core strength exercises`);

    // Display seeded exercises
    result.forEach((exercise, index) => {
      console.log(`${index + 1}. ${exercise.title} - ${exercise.videoUrls.length} video(s) - ${exercise.targetArea}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding core strength exercises:', error);
    process.exit(1);
  }
}

seedCoreStrength();
