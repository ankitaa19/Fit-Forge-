const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fitforge', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// Define collections to check
const collections = [
  { name: 'Weight Loss', collection: 'weightloss' },
  { name: 'Muscle Gain', collection: 'musclegain' },
  { name: 'Core Strength', collection: 'corestrength' },
  { name: 'Flexibility & Mobility', collection: 'flexibilitymobilities' },
  { name: 'Endurance', collection: 'endurances' },
  { name: 'General Fitness', collection: 'generalfitnesses' }
];

// Helper function to extract video ID from URL or return as-is if already an ID
function extractVideoId(urlOrId) {
  if (!urlOrId) return null;

  // If it's already an 11-character ID, return it
  if (urlOrId.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }

  // Try to extract from full URL
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match) return match[1];
  }

  return null;
}

async function checkVideoUrls() {
  console.log('\n🔍 CHECKING ALL YOUTUBE VIDEO URLS\n');
  console.log('='.repeat(80));

  const issuesFound = [];
  let totalExercises = 0;
  let totalVideos = 0;

  for (const goal of collections) {
    console.log(`\n📋 ${goal.name.toUpperCase()}`);
    console.log('-'.repeat(80));

    try {
      const exercises = await db.collection(goal.collection).find({}).toArray();
      totalExercises += exercises.length;

      if (exercises.length === 0) {
        console.log(`  ⚠️  No exercises found in this collection`);
        continue;
      }

      for (const exercise of exercises) {
        const videoUrls = exercise.videoUrls || [];

        if (videoUrls.length === 0) {
          issuesFound.push({
            goal: goal.name,
            exercise: exercise.title,
            issue: 'No video URLs',
            urls: []
          });
          console.log(`  ❌ ${exercise.title}: NO VIDEOS`);
        } else {
          totalVideos += videoUrls.length;
          const validVideos = [];

          // Check each video URL
          for (let i = 0; i < videoUrls.length; i++) {
            const rawValue = videoUrls[i];
            const videoId = extractVideoId(rawValue);

            if (videoId) {
              validVideos.push({
                index: i + 1,
                videoId: videoId,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                raw: rawValue
              });
            } else {
              issuesFound.push({
                goal: goal.name,
                exercise: exercise.title,
                issue: 'Invalid or unparseable video URL',
                urls: [{
                  index: i + 1,
                  videoId: rawValue || 'MISSING',
                  url: 'N/A'
                }]
              });
              console.log(`  ❌ ${exercise.title}: Video ${i + 1} invalid (${rawValue})`);
            }
          }

          if (validVideos.length === videoUrls.length) {
            console.log(`  ✅ ${exercise.title}: ${videoUrls.length} video(s)`);
          } else if (validVideos.length > 0) {
            console.log(`  ⚠️  ${exercise.title}: ${validVideos.length}/${videoUrls.length} valid video(s)`);
          }
        }
      }
    } catch (error) {
      console.log(`  ❌ Error checking collection: ${error.message}`);
    }
  }

  // Summary report
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY REPORT');
  console.log('='.repeat(80));
  console.log(`Total Exercises: ${totalExercises}`);
  console.log(`Total Videos: ${totalVideos}`);
  console.log(`Issues Found: ${issuesFound.length}\n`);

  if (issuesFound.length > 0) {
    console.log('⚠️  EXERCISES WITH ISSUES:\n');
    issuesFound.forEach((issue, idx) => {
      console.log(`${idx + 1}. [${issue.goal}] ${issue.exercise}`);
      console.log(`   Issue: ${issue.issue}`);
      if (issue.urls.length > 0) {
        issue.urls.forEach(v => {
          console.log(`   - Video ${v.index}: ${v.videoId} (${v.url})`);
        });
      }
      console.log('');
    });
  } else {
    console.log('✅ All exercises have valid video URL formats!\n');
  }

  console.log('\n📝 NOTE: This script only checks URL format. To verify videos actually exist on YouTube,');
  console.log('   please manually click each link above or use a video validation service.\n');
  console.log('   Common reasons for videos not working:');
  console.log('   - Video has been deleted by owner');
  console.log('   - Video is set to private');
  console.log('   - Video ID is incorrect\n');
}

db.once('open', async () => {
  try {
    await checkVideoUrls();
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});
