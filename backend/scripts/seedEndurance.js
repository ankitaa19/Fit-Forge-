const mongoose = require('mongoose');
require('dotenv').config();
const Endurance = require('../models/Endurance');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

const enduranceExercises = [
  {
    title: 'Running in Place',
    videoUrls: [
      'https://www.youtube.com/watch?v=lqJYJ7t1G0M',
      'https://www.youtube.com/watch?v=R3AUw3-jtEo'
    ],
    description: 'Simple cardio exercise to build endurance and stamina',
    durationSeconds: 60,
    duration: '60s',
    level: 'Beginner',
    recommended: true,
    exerciseType: 'Cardio',
  caloriesBurned: 10
  },
  {
    title: 'High Knees',
    videoUrls: [
      'https://www.youtube.com/watch?v=OAJ_J3EZkdY',
      'https://www.youtube.com/watch?v=ZZZoCNMU48o'
    ],
    description: 'High-intensity cardio that builds leg strength and cardiovascular endurance',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: true,
    exerciseType: 'HIIT',
  caloriesBurned: 10
  },
  {
    title: 'Jump Rope',
    videoUrls: [
      'https://www.youtube.com/watch?v=1BZM6jA1sM4',
      'https://www.youtube.com/watch?v=u3zgHI8QnqE'
    ],
    description: 'Classic cardio exercise for building endurance and coordination',
    durationSeconds: 60,
    duration: '60s',
    level: 'Beginner',
    recommended: true,
    exerciseType: 'Cardio',
  caloriesBurned: 10
  },
  {
    title: 'Burpees',
    videoUrls: [
      'https://www.youtube.com/watch?v=dZgVxmf6jkA',
      'https://www.youtube.com/watch?v=TU8QYVW0gDU'
    ],
    description: 'Full-body HIIT exercise that builds explosive power and endurance',
    durationSeconds: 40,
    duration: '40s',
    level: 'Advanced',
    recommended: true,
    exerciseType: 'HIIT',
  caloriesBurned: 10
  },
  {
    title: 'Cycling Simulation',
    videoUrls: [
      'https://www.youtube.com/watch?v=9FGilxCbdz8',
      'https://www.youtube.com/watch?v=1we3bh9uhqY'
    ],
    description: 'Low-impact cardio exercise for building leg endurance',
    durationSeconds: 60,
    duration: '60s',
    level: 'Beginner',
    recommended: true,
    exerciseType: 'Cardio',
  caloriesBurned: 10
  },
  {
    title: 'Sprint Intervals',
    videoUrls: [
      'https://www.youtube.com/watch?v=1skBf6h2ksI',
      'https://www.youtube.com/watch?v=QOVaHwm-Q6U'
    ],
    description: 'High-intensity intervals for maximum endurance and speed',
    durationSeconds: 30,
    duration: '30s',
    level: 'Advanced',
    recommended: true,
    exerciseType: 'HIIT',
  caloriesBurned: 10
  },
  {
    title: 'Skater Jumps',
    videoUrls: [
      'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
      'https://www.youtube.com/watch?v=1n9m7M3qTqQ'
    ],
    description: 'Lateral plyometric exercise for building power and endurance',
    durationSeconds: 40,
    duration: '40s',
    level: 'Intermediate',
    recommended: false,
    exerciseType: 'Plyometric',
  caloriesBurned: 10
  },
  {
    title: 'Fast Feet Drill',
    videoUrls: [
      'https://www.youtube.com/watch?v=7s1V7E5nX2Q'
    ],
    description: 'Agility drill that improves foot speed and cardiovascular fitness',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: false,
    exerciseType: 'Agility',
  caloriesBurned: 10
  },
  {
    title: 'Jumping Lunges',
    videoUrls: [
      'https://www.youtube.com/watch?v=wrwwXE_x-pQ',
      'https://www.youtube.com/watch?v=MxfTNXSFiYI'
    ],
    description: 'Explosive leg exercise that builds strength and endurance',
    durationSeconds: 40,
    duration: '40s',
    level: 'Advanced',
    recommended: true,
    exerciseType: 'Plyometric',
  caloriesBurned: 10
  },
  {
    title: 'Speed Squats',
    videoUrls: [
      'https://www.youtube.com/watch?v=aclHkVaku9U',
      'https://www.youtube.com/watch?v=YaXPRqUwItQ'
    ],
    description: 'Fast-paced squats for building leg endurance and power',
    durationSeconds: 45,
    duration: '45s',
    level: 'Intermediate',
    recommended: false,
    exerciseType: 'HIIT',
  caloriesBurned: 10
  },
  {
    title: 'Box Step Runs',
    videoUrls: [
      'https://www.youtube.com/watch?v=dQqApCGd5Ss',
      'https://www.youtube.com/watch?v=wc8tQh4uCkg'
    ],
    description: 'Cardio exercise that builds leg strength and cardiovascular endurance',
    durationSeconds: 50,
    duration: '50s',
    level: 'Beginner',
    recommended: true,
    exerciseType: 'Cardio',
  caloriesBurned: 10
  },
  {
    title: 'Lateral Shuffle',
    videoUrls: [
      'https://www.youtube.com/watch?v=3VcKaXpzqRo'
    ],
    description: 'Lateral movement drill for agility and endurance',
    durationSeconds: 40,
    duration: '40s',
    level: 'Intermediate',
    recommended: false,
    exerciseType: 'Agility',
  caloriesBurned: 10
  },
  {
    title: 'Power Skips',
    videoUrls: [
      'https://www.youtube.com/watch?v=1BZM6jA1sM4'
    ],
    description: 'Explosive plyometric exercise for building power and endurance',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: false,
    exerciseType: 'Plyometric',
  caloriesBurned: 10
  },
  {
    title: 'Broad Jumps',
    videoUrls: [
      'https://www.youtube.com/watch?v=4hJfN0W2C0Q'
    ],
    description: 'Explosive forward jumps for building lower body power',
    durationSeconds: 30,
    duration: '30s',
    level: 'Advanced',
    recommended: false,
    exerciseType: 'Plyometric',
  caloriesBurned: 10
  },
  {
    title: 'Tuck Jumps',
    videoUrls: [
      'https://www.youtube.com/watch?v=0iNn0p1XkzM',
      'https://www.youtube.com/watch?v=Y2o1k3t2u9M'
    ],
    description: 'High-intensity plyometric exercise for explosive power',
    durationSeconds: 30,
    duration: '30s',
    level: 'Advanced',
    recommended: false,
    exerciseType: 'HIIT',
  caloriesBurned: 10
  }
];

async function seedEndurance() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected...');

    // Clear existing endurance exercises
    await Endurance.deleteMany({});
    console.log('Cleared existing endurance exercises');

    // Insert new exercises
    const result = await Endurance.insertMany(enduranceExercises);
    console.log(`✅ Successfully seeded ${result.length} endurance exercises`);

    // Display seeded exercises
    result.forEach((exercise, index) => {
      console.log(`${index + 1}. ${exercise.title} - ${exercise.videoUrls.length} video(s) - ${exercise.exerciseType}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding endurance exercises:', error);
    process.exit(1);
  }
}

seedEndurance();
