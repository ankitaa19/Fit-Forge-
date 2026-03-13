const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fitforge');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');
  console.log('FINAL VERIFICATION - Checking all exercises have goal-oriented descriptions...\n');

  let totalExercises = 0;
  let totalComplete = 0;
  let totalIssues = 0;

  try {
    const collections = [
      { name: 'weightloss', displayName: 'WEIGHT LOSS' },
      { name: 'musclegain', displayName: 'MUSCLE GAIN' },
      { name: 'corestrength', displayName: 'CORE STRENGTH' },
      { name: 'flexibilitymobilities', displayName: 'FLEXIBILITY & MOBILITY' },
      { name: 'endurances', displayName: 'ENDURANCE' },
      { name: 'generalfitnesses', displayName: 'GENERAL FITNESS' }
    ];

    for (const collection of collections) {
      console.log(`\n=== ${collection.displayName} ===`);
      const col = db.collection(collection.name);
      const exercises = await col.find({}).toArray();

      console.log(`Total exercises: ${exercises.length}`);

      let shortWhat = 0;
      let shortWhy = 0;
      let shortHow = 0;
      let missing = 0;

      exercises.forEach(ex => {
        totalExercises++;

        // Check if fields exist and have substantial content (>100 chars as threshold for detailed descriptions)
        const hasWhat = ex.what && ex.what.length > 100;
        const hasWhy = ex.why && ex.why.length > 100;
        const hasHow = ex.how && ex.how.length > 100;

        if (hasWhat && hasWhy && hasHow) {
          totalComplete++;
        } else {
          totalIssues++;
          console.log(`  ⚠️  ${ex.title}:`);
          if (!ex.what) {
            console.log(`      - Missing WHAT`);
            missing++;
          } else if (!hasWhat) {
            console.log(`      - WHAT too short (${ex.what.length} chars)`);
            shortWhat++;
          }

          if (!ex.why) {
            console.log(`      - Missing WHY`);
            missing++;
          } else if (!hasWhy) {
            console.log(`      - WHY too short (${ex.why.length} chars)`);
            shortWhy++;
          }

          if (!ex.how) {
            console.log(`      - Missing HOW`);
            missing++;
          } else if (!hasHow) {
            console.log(`      - HOW too short (${ex.how.length} chars)`);
            shortHow++;
          }
        }
      });

      console.log(`✅ Complete: ${exercises.length - (shortWhat + shortWhy + shortHow + missing / 3)}`);
      if (shortWhat + shortWhy + shortHow + missing > 0) {
        console.log(`⚠️  Issues found in this collection`);
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`FINAL SUMMARY`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Total Exercises: ${totalExercises}`);
    console.log(`Complete (comprehensive descriptions): ${totalComplete}`);
    console.log(`Issues found: ${totalIssues}`);
    console.log(`\nCompletion Rate: ${((totalComplete / totalExercises) * 100).toFixed(1)}%`);

    if (totalComplete === totalExercises) {
      console.log(`\n✅ SUCCESS! All ${totalExercises} exercises have comprehensive, goal-oriented descriptions!`);
    }
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    console.error('Error:', error);
  }

  await mongoose.connection.close();
  process.exit(0);
});
