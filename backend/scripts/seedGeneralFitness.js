const mongoose = require('mongoose');
require('dotenv').config();
const GeneralFitness = require('../models/GeneralFitness');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

const generalFitnessExercises = [
  {
    title: 'Jumping Jacks',
    videoUrls: [
      'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
      'https://www.youtube.com/watch?v=iSSAk4XCsRA',
      'https://www.youtube.com/watch?v=UpH7rm0cYbM'
    ],
    description: 'Classic cardio exercise for warming up and improving overall fitness',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    category: 'Cardio',
  caloriesBurned: 8
  },
  {
    title: 'Bodyweight Squats',
    videoUrls: [
      'https://www.youtube.com/watch?v=aclHkVaku9U',
      'https://www.youtube.com/watch?v=YaXPRqUwItQ',
      'https://www.youtube.com/watch?v=ultWZbUMPL8'
    ],
    description: 'Fundamental lower body exercise for building leg strength',
    durationSeconds: 40,
    duration: '40s',
    level: 'Beginner',
    recommended: true,
    category: 'Strength',
  caloriesBurned: 8
  },
  {
    title: 'Arm Circles',
    videoUrls: [
      'https://www.youtube.com/watch?v=140RTNMciH8',
      'https://www.youtube.com/watch?v=ZkK4Zx4S1Rw'
    ],
    description: 'Simple mobility exercise for warming up the shoulders',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: true,
    category: 'Mobility',
  caloriesBurned: 8
  },
  {
    title: 'Light Jogging in Place',
    videoUrls: [
      'https://www.youtube.com/watch?v=R3AUw3-jtEo',
      'https://www.youtube.com/watch?v=lqJYJ7t1G0M'
    ],
    description: 'Low-impact cardio for warming up and building endurance',
    durationSeconds: 60,
    duration: '60s',
    level: 'Beginner',
    recommended: true,
    category: 'Cardio',
  caloriesBurned: 8
  },
  {
    title: 'Step Ups',
    videoUrls: [
      'https://www.youtube.com/watch?v=dQqApCGd5Ss',
      'https://www.youtube.com/watch?v=wc8tQh4uCkg'
    ],
    description: 'Simple cardio exercise using a step or platform',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    category: 'Cardio',
  caloriesBurned: 8
  },
  {
    title: 'Marching in Place',
    videoUrls: [
      'https://www.youtube.com/watch?v=R3AUw3-jtEo'
    ],
    description: 'Gentle cardio movement for warming up',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: false,
    category: 'Cardio',
  caloriesBurned: 8
  },
  {
    title: 'Standing Knee Raises',
    videoUrls: [
      'https://www.youtube.com/watch?v=K2VljzCC16g',
      'https://www.youtube.com/watch?v=fZ3xT5K_8C0'
    ],
    description: 'Balance and core exercise with alternating knee lifts',
    durationSeconds: 40,
    duration: '40s',
    level: 'Beginner',
    recommended: true,
    category: 'Balance',
  caloriesBurned: 8
  },
  {
    title: 'Side Leg Raises',
    videoUrls: [
      'https://www.youtube.com/watch?v=jgh6sGwtTwk',
      'https://www.youtube.com/watch?v=JB2oyawG9KI'
    ],
    description: 'Strengthens the outer thighs and hip muscles',
    durationSeconds: 35,
    duration: '35s',
    level: 'Beginner',
    recommended: false,
    category: 'Strength',
  caloriesBurned: 8
  },
  {
    title: 'Torso Twists',
    videoUrls: [
      'https://www.youtube.com/watch?v=F8Kf3Yd0XkU',
      'https://www.youtube.com/watch?v=IY0fY2QJx5g'
    ],
    description: 'Improves spinal mobility and warms up the core',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: false,
    category: 'Mobility',
  caloriesBurned: 8
  },
  {
    title: 'Wall Push Ups',
    videoUrls: [
      'https://www.youtube.com/watch?v=Eh00_rniF8E',
      'https://www.youtube.com/watch?v=0pkjOk0EiAk'
    ],
    description: 'Beginner-friendly push-up variation for building upper body strength',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: true,
    category: 'Strength',
  caloriesBurned: 8
  },
  {
    title: 'Shoulder Rolls',
    videoUrls: [
      'https://www.youtube.com/watch?v=7c2h0rJg3Pc'
    ],
    description: 'Relieves shoulder tension and improves mobility',
    durationSeconds: 25,
    duration: '25s',
    level: 'Beginner',
    recommended: false,
    category: 'Mobility',
  caloriesBurned: 8
  },
  {
    title: 'Heel Raises',
    videoUrls: [
      'https://www.youtube.com/watch?v=-M4-G8p8fmc',
      'https://www.youtube.com/watch?v=YMmgqO8Jo-k'
    ],
    description: 'Strengthens calf muscles and improves ankle stability',
    durationSeconds: 35,
    duration: '35s',
    level: 'Beginner',
    recommended: false,
    category: 'Strength',
  caloriesBurned: 8
  },
  {
    title: 'Standing Side Bends',
    videoUrls: [
      'https://www.youtube.com/watch?v=G4y6nWcE5W0',
      'https://www.youtube.com/watch?v=7t9H4cVQ1zA'
    ],
    description: 'Stretches the obliques and improves lateral mobility',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: false,
    category: 'Mobility',
  caloriesBurned: 8
  },
  {
    title: 'Low Impact Jumping Jacks',
    videoUrls: [
      'https://www.youtube.com/watch?v=1p6Qh3fA8sE',
      'https://www.youtube.com/watch?v=c4DAnQ6DtF8'
    ],
    description: 'Gentle cardio variation suitable for all fitness levels',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    category: 'Cardio',
  caloriesBurned: 8
  },
  {
    title: 'Light Mountain Climbers',
    videoUrls: [
      'https://www.youtube.com/watch?v=nmwgirgXLYM',
      'https://www.youtube.com/watch?v=cnyTQDSE884'
    ],
    description: 'Low-intensity core and cardio exercise',
    durationSeconds: 40,
    duration: '40s',
    level: 'Beginner',
    recommended: true,
    category: 'Cardio',
  caloriesBurned: 8
  }
];

async function seedGeneralFitness() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected...');

    // Clear existing general fitness exercises
    await GeneralFitness.deleteMany({});
    console.log('Cleared existing general fitness exercises');

    // Insert new exercises
    const result = await GeneralFitness.insertMany(generalFitnessExercises);
    console.log(`✅ Successfully seeded ${result.length} general fitness exercises`);

    // Display seeded exercises
    result.forEach((exercise, index) => {
      console.log(`${index + 1}. ${exercise.title} - ${exercise.videoUrls.length} video(s) - ${exercise.category}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding general fitness exercises:', error);
    process.exit(1);
  }
}

seedGeneralFitness();
