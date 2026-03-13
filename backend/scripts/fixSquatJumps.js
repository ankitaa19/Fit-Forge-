const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fitforge');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');

  try {
    const col = db.collection('weightloss');

    // Fix the one slightly short description
    const result = await col.updateOne(
      { title: 'Squat Jumps' },
      {
        $set: {
          what: 'Squat Jumps combine a deep squat with an explosive vertical jump, engaging legs powerfully for maximum calorie burn.'
        }
      }
    );

    if (result.matchedCount > 0) {
      console.log('✅ Fixed Squat Jumps description\n');
    }

  } catch (error) {
    console.error('Error:', error);
  }

  await mongoose.connection.close();
  process.exit(0);
});
