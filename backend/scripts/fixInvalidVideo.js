const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

async function fixInvalidVideo() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const musclegain = db.collection('musclegain'); // Fixed collection name

    // Find the exercise with the invalid video URL
    const exercise = await musclegain.findOne({
      title: 'Decline Push Ups'
    });

    if (exercise) {
      console.log('Found exercise:', exercise.title);
      console.log('Current URLs:', exercise.videoUrls);

      // Check if the invalid URL exists
      const hasInvalidUrl = exercise.videoUrls.some(url => url.includes('SKPab2YC8lA'));

      if (hasInvalidUrl) {
        console.log('Invalid URL found! Replacing...');

        // Replace the invalid URL with a valid decline push-ups video
        const result = await musclegain.updateOne(
          { _id: exercise._id },
          {
            $set: {
              videoUrls: [
                'https://www.youtube.com/watch?v=I7ovLvP_cR4', // Valid decline push-ups video
                'https://www.youtube.com/watch?v=L-Yd2YpIDkI'  // Keep the second valid URL
              ]
            }
          }
        );

        console.log('✅ Fixed! Update result:', result);
        console.log('New URL: https://www.youtube.com/watch?v=I7ovLvP_cR4');
      } else {
        console.log('✅ URL already fixed!');
      }
    } else {
      console.log('❌ Exercise not found or already fixed');
    }

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixInvalidVideo();
