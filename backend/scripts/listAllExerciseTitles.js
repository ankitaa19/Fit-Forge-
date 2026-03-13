const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fitforge');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');

  const collections = ['weightloss', 'musclegain', 'corestrength', 'flexibilitymobilities', 'endurances', 'generalfitnesses'];

  for (const collName of collections) {
    console.log(`\n=== ${collName.toUpperCase()} ===`);
    const coll = db.collection(collName);
    const exercises = await coll.find({}, { title: 1, _id: 0 }).toArray();
    exercises.forEach((ex, i) => {
      console.log(`${i + 1}. ${ex.title}`);
    });
  }

  await mongoose.connection.close();
  process.exit(0);
});
