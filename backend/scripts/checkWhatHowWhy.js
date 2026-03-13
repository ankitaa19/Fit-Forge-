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
    { name: 'weightloss', displayName: 'Weight Loss' },
    { name: 'musclegain', displayName: 'Muscle Gain' },
    { name: 'corestrength', displayName: 'Core Strength' },
    { name: 'flexibilitymobilities', displayName: 'Flexibility & Mobility' },
    { name: 'endurances', displayName: 'Endurance' },
    { name: 'generalfitnesses', displayName: 'General Fitness' },
  ];

  let totalExercises = 0;
  let exercisesComplete = 0;
  let exercisesMissingFields = [];

  for (const collectionInfo of collections) {
    const collectionName = collectionInfo.name;
    const displayName = collectionInfo.displayName;

    console.log(`\n=== Checking ${displayName} (${collectionName}) ===`);

    try {
      const collection = db.collection(collectionName);
      const exercises = await collection.find({}).toArray();

      if (exercises.length === 0) {
        console.log('  No exercises found');
        continue;
      }

      totalExercises += exercises.length;
      console.log(`  Total exercises: ${exercises.length}`);

      let missingWhat = 0;
      let missingWhy = 0;
      let missingHow = 0;
      let missingAll = 0;
      let hasAll = 0;

      for (const exercise of exercises) {
        const hasWhat = exercise.what && exercise.what.trim() !== '';
        const hasWhy = exercise.why && exercise.why.trim() !== '';
        const hasHow = exercise.how && exercise.how.trim() !== '';

        if (!hasWhat) missingWhat++;
        if (!hasWhy) missingWhy++;
        if (!hasHow) missingHow++;

        if (!hasWhat && !hasWhy && !hasHow) {
          missingAll++;
          exercisesMissingFields.push({
            name: exercise.title,
            collection: displayName,
            missingFields: 'all (what, why, how)'
          });
        } else if (!hasWhat || !hasWhy || !hasHow) {
          const missing = [];
          if (!hasWhat) missing.push('what');
          if (!hasWhy) missing.push('why');
          if (!hasHow) missing.push('how');
          exercisesMissingFields.push({
            name: exercise.title,
            collection: displayName,
            missingFields: missing.join(', ')
          });
        } else {
          hasAll++;
          exercisesComplete++;
        }
      }

      console.log(`  ✅ Complete (has all 3 fields): ${hasAll}`);
      console.log(`  ❌ Missing 'what': ${missingWhat}`);
      console.log(`  ❌ Missing 'why': ${missingWhy}`);
      console.log(`  ❌ Missing 'how': ${missingHow}`);
      console.log(`  ❌ Missing all fields: ${missingAll}`);

    } catch (error) {
      console.log(`  Error checking ${collectionName}: ${error.message}`);
    }
  }

  console.log('\n\n=== OVERALL SUMMARY ===');
  console.log(`Total exercises in database: ${totalExercises}`);
  console.log(`✅ Exercises with all fields (what, why, how): ${exercisesComplete}`);
  console.log(`❌ Exercises with missing fields: ${exercisesMissingFields.length}`);
  console.log(`Completion rate: ${((exercisesComplete / totalExercises) * 100).toFixed(1)}%`);

  if (exercisesMissingFields.length > 0) {
    console.log('\n=== EXERCISES WITH MISSING FIELDS ===');
    exercisesMissingFields.forEach((ex, index) => {
      console.log(`${index + 1}. ${ex.name} (${ex.collection})`);
      console.log(`   Missing: ${ex.missingFields}`);
    });
  }

  await mongoose.connection.close();
  process.exit(0);
});
