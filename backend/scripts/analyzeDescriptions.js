const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fitforge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');

  const collections = [
    { name: 'weightloss', displayName: 'Weight Loss', goal: 'weight loss and calorie burning' },
    { name: 'musclegain', displayName: 'Muscle Gain', goal: 'building muscle mass and strength' },
    { name: 'corestrength', displayName: 'Core Strength', goal: 'building core stability and strength' },
    { name: 'flexibilitymobilities', displayName: 'Flexibility & Mobility', goal: 'improving flexibility and range of motion' },
    { name: 'endurances', displayName: 'Endurance', goal: 'building cardiovascular endurance and stamina' },
    { name: 'generalfitnesses', displayName: 'General Fitness', goal: 'overall fitness and health' },
  ];

  console.log('=== SAMPLE DESCRIPTIONS FROM EACH COLLECTION ===\n');

  for (const collectionInfo of collections) {
    const collectionName = collectionInfo.name;
    const displayName = collectionInfo.displayName;

    console.log(`\n========== ${displayName.toUpperCase()} ==========`);

    try {
      const collection = db.collection(collectionName);
      const exercises = await collection.find({}).limit(3).toArray();

      exercises.forEach((exercise, index) => {
        console.log(`\n[${index + 1}] ${exercise.title}`);
        console.log('   Description:', exercise.description);
        console.log('   WHAT:', exercise.what || 'MISSING');
        console.log('   WHY:', exercise.why || 'MISSING');
        console.log('   HOW:', exercise.how || 'MISSING');
        console.log('   Video URLs:', exercise.videoUrls?.length || 0, 'videos');
      });

    } catch (error) {
      console.log(`  Error checking ${collectionName}: ${error.message}`);
    }
  }

  await mongoose.connection.close();
  process.exit(0);
});
