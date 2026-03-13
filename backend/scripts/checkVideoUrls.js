const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fitness-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');

  const collections = [
    'weightlosses',
    'musclegains',
    'corestrengths',
    'flexibilitymobilities',
    'endurances',
    'generalfitnesses',
  ];

  let totalExercises = 0;
  let exercisesWithVideos = 0;
  let exercisesWithoutVideos = 0;
  const exercisesMissingVideos = [];

  for (const collectionName of collections) {
    console.log(`Checking ${collectionName}:`);
    
    try {
      const collection = db.collection(collectionName);
      const exercises = await collection.find({}).toArray();
      
      totalExercises += exercises.length;
      console.log(`  ${exercises.length} exercises`);

      for (const exercise of exercises) {
        const hasVideo = exercise.videoUrls && 
                        Array.isArray(exercise.videoUrls) && 
                        exercise.videoUrls.length > 0 &&
                        exercise.videoUrls[0] !== '';
        
        if (hasVideo) {
          exercisesWithVideos++;
        } else {
          exercisesWithoutVideos++;
          exercisesMissingVideos.push({
            name: exercise.title,
            collection: collectionName,
            videoUrls: exercise.videoUrls || 'undefined'
          });
        }
      }
    } catch (error) {
      console.log(`  Error checking ${collectionName}: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Total exercises: ${totalExercises}`);
  console.log(`Exercises with video URLs: ${exercisesWithVideos}`);
  console.log(`Exercises without video URLs: ${exercisesWithoutVideos}`);

  if (exercisesMissingVideos.length > 0) {
    console.log('\n=== EXERCISES WITHOUT VIDEO URLS ===');
    exercisesMissingVideos.forEach(ex => {
      console.log(`  - ${ex.name} (${ex.collection}): videoUrls = ${JSON.stringify(ex.videoUrls)}`);
    });
  }

  await mongoose.connection.close();
  process.exit(0);
});
