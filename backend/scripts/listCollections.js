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

  try {
    // List all collections in the database
    const collections = await db.db.listCollections().toArray();
    
    console.log('Collections in database:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    console.log('\n');

    // Now check each collection for exercise data
    for (const col of collections) {
      const collection = db.collection(col.name);
      const count = await collection.countDocuments();
      
      if (count > 0) {
        console.log(`\n${col.name}: ${count} documents`);
        
        // Get a sample document to see structure
        const sample = await collection.findOne({});
        if (sample) {
          console.log('  Sample fields:', Object.keys(sample).join(', '));
          console.log('  Has videoUrls?', sample.videoUrls !== undefined);
          if (sample.videoUrls) {
            console.log('  videoUrls type:', Array.isArray(sample.videoUrls) ? 'Array' : typeof sample.videoUrls);
            console.log('  videoUrls length:', sample.videoUrls.length);
            if (sample.videoUrls.length > 0) {
              console.log('  First videoUrl:', sample.videoUrls[0]);
            }
          }
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }

  await mongoose.connection.close();
  process.exit(0);
});
