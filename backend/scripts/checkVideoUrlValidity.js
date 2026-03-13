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

  function extractVideoId(videoUrl) {
    if (!videoUrl || videoUrl === '') return null;
    try {
      const url = new URL(videoUrl);
      if (url.hostname.includes('youtube.com')) {
        return url.searchParams.get('v');
      } else if (url.hostname.includes('youtu.be')) {
        return url.pathname.substring(1);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  let totalVideos = 0;
  let validVideos = 0;
  let invalidVideos = 0;
  const problemVideos = [];

  for (const collectionInfo of collections) {
    const collectionName = collectionInfo.name;
    const displayName = collectionInfo.displayName;

    console.log(`\n=== Checking ${displayName} ===`);

    try {
      const collection = db.collection(collectionName);
      const exercises = await collection.find({}).toArray();

      for (const exercise of exercises) {
        if (!exercise.videoUrls || exercise.videoUrls.length === 0) {
          problemVideos.push({
            exercise: exercise.title,
            collection: displayName,
            issue: 'No video URLs'
          });
          continue;
        }

        for (let i = 0; i < exercise.videoUrls.length; i++) {
          const videoUrl = exercise.videoUrls[i];
          totalVideos++;
          const videoId = extractVideoId(videoUrl);

          if (videoId) {
            validVideos++;
          } else {
            invalidVideos++;
            problemVideos.push({
              exercise: exercise.title,
              collection: displayName,
              issue: `Invalid video URL: ${videoUrl}`
            });
          }
        }
      }

    } catch (error) {
      console.log(`  Error checking ${collectionName}: ${error.message}`);
    }
  }

  console.log('\n\n=== VIDEO URL ANALYSIS ===');
  console.log(`Total video URLs checked: ${totalVideos}`);
  console.log(`✅ Valid YouTube URLs: ${validVideos}`);
  console.log(`❌ Invalid URLs: ${invalidVideos}`);

  if (problemVideos.length > 0) {
    console.log('\n=== PROBLEM VIDEOS ===');
    problemVideos.forEach((item, index) => {
      console.log(`${index + 1}. ${item.exercise} (${item.collection})`);
      console.log(`   Issue: ${item.issue}\n`);
    });
  } else {
    console.log('\n✅ All video URLs are valid!');
  }

  await mongoose.connection.close();
  process.exit(0);
});
