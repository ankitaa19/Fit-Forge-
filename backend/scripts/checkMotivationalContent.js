const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fitforge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  const collections = [
    'weightloss',
    'musclegain', 
    'corestrength',
    'flexibilitymobilities',
    'endurances',
    'generalfitnesses'
  ];
  
  let totalExercises = 0;
  let exercisesWithContent = 0;
  let exercisesWithoutContent = [];
  
  for (const collectionName of collections) {
    const collection = mongoose.connection.collection(collectionName);
    const exercises = await collection.find({}).toArray();
    
    console.log(`\nChecking ${collectionName}: ${exercises.length} exercises`);
    
    for (const exercise of exercises) {
      totalExercises++;
      const hasWhat = exercise.what && exercise.what.trim().length > 0;
      const hasWhy = exercise.why && exercise.why.trim().length > 0;
      const hasHow = exercise.how && exercise.how.trim().length > 0;
      
      if (hasWhat && hasWhy && hasHow) {
        exercisesWithContent++;
      } else {
        exercisesWithoutContent.push({
          collection: collectionName,
          name: exercise.title || exercise.name,
          missing: {
            what: !hasWhat,
            why: !hasWhy,
            how: !hasHow
          }
        });
      }
    }
  }
  
  console.log('\n=== SUMMARY ===');
  console.log('Total exercises:', totalExercises);
  console.log('Exercises with complete what/why/how:', exercisesWithContent);
  console.log('Exercises missing content:', exercisesWithoutContent.length);
  
  if (exercisesWithoutContent.length > 0) {
    console.log('\n=== EXERCISES WITHOUT COMPLETE CONTENT ===');
    exercisesWithoutContent.forEach(ex => {
      const missing = Object.keys(ex.missing).filter(k => ex.missing[k]);
      console.log(`  - ${ex.name} (${ex.collection}): Missing ${missing.join(', ')}`);
    });
  } else {
    console.log('\n✅ All exercises have complete what/why/how content!');
  }
  
  await mongoose.disconnect();
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
