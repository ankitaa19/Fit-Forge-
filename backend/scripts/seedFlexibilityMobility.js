const mongoose = require('mongoose');
require('dotenv').config();
const FlexibilityMobility = require('../models/FlexibilityMobility');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

const flexibilityMobilityExercises = [
  {
    title: 'Hamstring Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=vfKwjT5-86k',
      'https://www.youtube.com/watch?v=2P0JdJYx4Kc'
    ],
    description: 'Stretches the hamstrings and lower back, improving flexibility',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: true,
    focusArea: 'Hamstrings',
  caloriesBurned: 5
  },
  {
    title: 'Cobra Pose',
    videoUrls: [
      'https://www.youtube.com/watch?v=JDcdhTuycOI',
      'https://www.youtube.com/watch?v=prG6xNwH9hM'
    ],
    description: 'Opens the chest and strengthens the spine, stretches abdominal muscles',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: true,
    focusArea: 'Back',
  caloriesBurned: 5
  },
  {
    title: 'Downward Dog',
    videoUrls: [
      'https://www.youtube.com/watch?v=EC7RGJ975iM',
      'https://www.youtube.com/watch?v=j97SSGsnCAQ'
    ],
    description: 'Full body stretch focusing on hamstrings, calves, and shoulders',
    durationSeconds: 40,
    duration: '40s',
    level: 'Intermediate',
    recommended: true,
    focusArea: 'Full Body',
  caloriesBurned: 5
  },
  {
    title: 'Hip Flexor Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=7bRaX6M2nr8',
      'https://www.youtube.com/watch?v=OZ9kqvY7uE0'
    ],
    description: 'Stretches the hip flexors and improves hip mobility',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: true,
    focusArea: 'Hips',
  caloriesBurned: 5
  },
  {
    title: 'Child Pose',
    videoUrls: [
      'https://www.youtube.com/watch?v=2MJGg-dUKh0',
      'https://www.youtube.com/watch?v=EQB6_s4Yp6Q'
    ],
    description: 'Relaxing stretch for the back, hips, and shoulders',
    durationSeconds: 45,
    duration: '45s',
    level: 'Beginner',
    recommended: true,
    focusArea: 'Back',
  caloriesBurned: 5
  },
  {
    title: 'Cat Cow Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=KpNZN5cR3xs',
      'https://www.youtube.com/watch?v=wBzFvQhVh6Q'
    ],
    description: 'Improves spinal flexibility and relieves back tension',
    durationSeconds: 40,
    duration: '40s',
    level: 'Beginner',
    recommended: true,
    focusArea: 'Spine',
  caloriesBurned: 5
  },
  {
    title: 'Seated Forward Fold',
    videoUrls: [
      'https://www.youtube.com/watch?v=T8sgVyF4Ux4',
      'https://www.youtube.com/watch?v=83s3J8v1YdA'
    ],
    description: 'Stretches the entire back of the body from head to heels',
    durationSeconds: 35,
    duration: '35s',
    level: 'Intermediate',
    recommended: false,
    focusArea: 'Hamstrings',
  caloriesBurned: 5
  },
  {
    title: 'Standing Quad Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=JbJdQYcKk3E',
      'https://www.youtube.com/watch?v=sZk9bG9n9V4'
    ],
    description: 'Stretches the quadriceps muscles and improves balance',
    durationSeconds: 25,
    duration: '25s',
    level: 'Beginner',
    recommended: true,
    focusArea: 'Quadriceps',
  caloriesBurned: 5
  },
  {
    title: 'Butterfly Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=9G2T4Lh1n1Q',
      'https://www.youtube.com/watch?v=hdh4x3pZ4Y4'
    ],
    description: 'Opens the hips and stretches the inner thighs',
    durationSeconds: 30,
    duration: '30s',
    level: 'Beginner',
    recommended: true,
    focusArea: 'Groin',
  caloriesBurned: 5
  },
  {
    title: 'Shoulder Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=KjJYkzH6yH4',
      'https://www.youtube.com/watch?v=G0VjCqV5p8Y'
    ],
    description: 'Stretches the shoulders and upper back',
    durationSeconds: 20,
    duration: '20s',
    level: 'Beginner',
    recommended: false,
    focusArea: 'Shoulders',
  caloriesBurned: 5
  },
  {
    title: 'Neck Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=6H5tZpS9jG8',
      'https://www.youtube.com/watch?v=U3Rk5fHnQ3g'
    ],
    description: 'Relieves neck tension and improves flexibility',
    durationSeconds: 20,
    duration: '20s',
    level: 'Beginner',
    recommended: false,
    focusArea: 'Neck',
  caloriesBurned: 5
  },
  {
    title: 'Spinal Twist Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=8b9F4nJcQ4E',
      'https://www.youtube.com/watch?v=U6sYpA0dJYg'
    ],
    description: 'Improves spinal rotation and relieves back tension',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: false,
    focusArea: 'Spine',
  caloriesBurned: 5
  },
  {
    title: 'Knee to Chest Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=3aRpAO6bfvA',
      'https://www.youtube.com/watch?v=2sE7b3mF0Ck'
    ],
    description: 'Stretches the lower back and hips',
    durationSeconds: 25,
    duration: '25s',
    level: 'Beginner',
    recommended: false,
    focusArea: 'Hips',
  caloriesBurned: 5
  },
  {
    title: 'Side Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=7kKJ5k0Zs8U',
      'https://www.youtube.com/watch?v=JfF4Rr9d4A8'
    ],
    description: 'Stretches the obliques and improves lateral flexibility',
    durationSeconds: 25,
    duration: '25s',
    level: 'Beginner',
    recommended: false,
    focusArea: 'Side Body',
  caloriesBurned: 5
  },
  {
    title: 'Lunge Stretch',
    videoUrls: [
      'https://www.youtube.com/watch?v=7bRaX6M2nr8',
      'https://www.youtube.com/watch?v=Q9lA0Fv3c1g'
    ],
    description: 'Deep hip flexor stretch in a lunge position',
    durationSeconds: 30,
    duration: '30s',
    level: 'Intermediate',
    recommended: true,
    focusArea: 'Hips',
  caloriesBurned: 5
  }
];

async function seedFlexibilityMobility() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected...');

    // Clear existing flexibility & mobility exercises
    await FlexibilityMobility.deleteMany({});
    console.log('Cleared existing flexibility & mobility exercises');

    // Insert new exercises
    const result = await FlexibilityMobility.insertMany(flexibilityMobilityExercises);
    console.log(`✅ Successfully seeded ${result.length} flexibility & mobility exercises`);

    // Display seeded exercises
    result.forEach((exercise, index) => {
      console.log(`${index + 1}. ${exercise.title} - ${exercise.videoUrls.length} video(s) - ${exercise.focusArea}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding flexibility & mobility exercises:', error);
    process.exit(1);
  }
}

seedFlexibilityMobility();
