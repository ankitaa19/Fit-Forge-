const mongoose = require('mongoose');
require('dotenv').config();
const WeightLoss = require('../models/WeightLoss');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

const weightLossExercises = [
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
    recommended: true,
    caloriesBurned: 8
  },
  {
    title: 'Burpees',
    videoUrls: [
      'https://www.youtube.com/watch?v=dZgVxmf6jkA',
      'https://www.youtube.com/watch?v=TU8QYVW0gDU',
      'https://www.youtube.com/watch?v=qLBImHhCXSw'
    ],
    description: 'High-intensity full-body exercise combining squat, plank, and jump',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: true,
    caloriesBurned: 12
  },
  {
    title: 'Mountain Climbers',
    videoUrls: [
      'https://www.youtube.com/watch?v=nmwgirgXLYM',
      'https://www.youtube.com/watch?v=cnyTQDSE884'
    ],
    description: 'Dynamic cardio exercise targeting core and total body conditioning',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: true,
    caloriesBurned: 10
  },
  {
    title: 'High Knees',
    videoUrls: [
      'https://www.youtube.com/watch?v=OAJ_J3EZkdY',
      'https://www.youtube.com/watch?v=ZZZoCNMU48o'
    ],
    description: 'Cardio exercise that elevates heart rate and strengthens legs',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: false,
    caloriesBurned: 9
  },
  {
    title: 'Squat Jumps',
    videoUrls: [
      'https://www.youtube.com/watch?v=U4s4mEQ5VqU',
      'https://www.youtube.com/watch?v=CVaEhXotL7M'
    ],
    description: 'Explosive lower body exercise that builds power and burns fat',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: true,
    caloriesBurned: 11
  },
  {
    title: 'Jump Rope',
    videoUrls: [
      'https://www.youtube.com/watch?v=1BZM6jA1sM4',
      'https://www.youtube.com/watch?v=u3zgHI8QnqE'
    ],
    description: 'Classic cardio exercise that improves coordination and burns calories',
    durationSeconds: 60,
    duration: '1 min',
    level: 'Beginner',
    recommended: true,
    caloriesBurned: 15
  },
  {
    title: 'Skater Jumps',
    videoUrls: [
      'https://www.youtube.com/watch?v=QOVaHwm-Q6U'
    ],
    description: 'Lateral movement exercise that targets legs and improves agility',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: false,
    caloriesBurned: 10
  },
  {
    title: 'Running in Place',
    videoUrls: [
      'https://www.youtube.com/watch?v=R3AUw3-jtEo'
    ],
    description: 'Simple cardio exercise that can be done anywhere',
    durationSeconds: 60,
    duration: '1 min',
    level: 'Beginner',
    recommended: false,
    caloriesBurned: 8
  },
  {
    title: 'Butt Kicks',
    videoUrls: [
      'https://www.youtube.com/watch?v=1zJZpX1Y6VQ'
    ],
    description: 'Dynamic cardio exercise that targets hamstrings and glutes',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: false,
    caloriesBurned: 7
  },
  {
    title: 'Side Lunges',
    videoUrls: [
      'https://www.youtube.com/watch?v=rvqLVxYqEvo'
    ],
    description: 'Lateral lunge variation that targets inner and outer thighs',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: false,
    caloriesBurned: 8
  },
  {
    title: 'Jump Squats',
    videoUrls: [
      'https://www.youtube.com/watch?v=U4s4mEQ5VqU'
    ],
    description: 'Plyometric squat variation for explosive power and fat loss',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: true,
    caloriesBurned: 11
  },
  {
    title: 'Step Touch Cardio',
    videoUrls: [
      'https://www.youtube.com/watch?v=ML6xKxG4vLk'
    ],
    description: 'Simple cardio movement perfect for warm-up or active recovery',
    durationSeconds: 60,
    duration: '1 min',
    level: 'Beginner',
    recommended: false,
    caloriesBurned: 6
  },
  {
    title: 'Plank Jacks',
    videoUrls: [
      'https://www.youtube.com/watch?v=J3e2nGv0X4U'
    ],
    description: 'Core-focused cardio exercise combining plank hold with jumping jacks',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: true,
    caloriesBurned: 9
  },
  {
    title: 'Star Jumps',
    videoUrls: [
      'https://www.youtube.com/watch?v=0iNn0p1XkzM'
    ],
    description: 'Full-body explosive movement that burns maximum calories',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: true,
    caloriesBurned: 10
  },
  {
    title: 'Fast Feet Drill',
    videoUrls: [
      'https://www.youtube.com/watch?v=7s1V7E5nX2Q'
    ],
    description: 'High-intensity footwork drill that improves speed and burns fat',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: false,
    caloriesBurned: 11
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing weight loss exercises
    await WeightLoss.deleteMany({});
    console.log('🗑️  Cleared existing weight loss exercises');

    // Insert weight loss exercises
    const result = await WeightLoss.insertMany(weightLossExercises);
    console.log(`✅ Successfully seeded ${result.length} weight loss exercises`);

    // Display summary
    console.log('\n📊 Seeded exercises in "weightloss" collection:');
    result.forEach((exercise, index) => {
      console.log(`${index + 1}. ${exercise.title} - ${exercise.videoUrls.length} video(s)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
