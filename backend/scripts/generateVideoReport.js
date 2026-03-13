const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

async function generateVideoReport() {
  console.log('📝 Generating comprehensive video report...\n');

  let markdownReport = '# FitForge Video URLs Report\n\n';
  markdownReport += `Generated: ${new Date().toLocaleString()}\n\n`;
  markdownReport += '## Summary\n\n';

  let totalExercises = 0;
  let totalVideos = 0;
  const allData = [];

  // Collect all data first
  for (const goal of collections) {
    const exercises = await db.collection(goal.collection).find({}).sort({ title: 1 }).toArray();
    totalExercises += exercises.length;

    const goalData = {
      name: goal.name,
      exercises: []
    };

    for (const exercise of exercises) {
      const videoUrls = exercise.videoUrls || [];
      totalVideos += videoUrls.length;

      const videos = [];
      for (let i = 0; i < videoUrls.length; i++) {
        const rawValue = videoUrls[i];
        const videoId = extractVideoId(rawValue);

        if (videoId) {
          videos.push({
            index: i + 1,
            videoId: videoId,
            url: `https://www.youtube.com/watch?v=${videoId}`
          });
        }
      }

      goalData.exercises.push({
        title: exercise.title,
        videos: videos
      });
    }

    allData.push(goalData);
  }

  // Add summary
  markdownReport += `- **Total Fitness Goals:** ${collections.length}\n`;
  markdownReport += `- **Total Exercises:** ${totalExercises}\n`;
  markdownReport += `- **Total Videos:** ${totalVideos}\n\n`;
  markdownReport += '---\n\n';

  // Generate detailed sections for each goal
  for (const goalData of allData) {
    markdownReport += `## ${goalData.name}\n\n`;
    markdownReport += `Total Exercises: ${goalData.exercises.length}\n\n`;

    for (const exercise of goalData.exercises) {
      markdownReport += `### ${exercise.title}\n\n`;

      if (exercise.videos.length === 0) {
        markdownReport += '⚠️ **NO VIDEOS AVAILABLE**\n\n';
      } else {
        for (const video of exercise.videos) {
          markdownReport += `- Video ${video.index}: [${video.videoId}](${video.url})\n`;
        }
        markdownReport += '\n';
      }
    }

    markdownReport += '---\n\n';
  }

  // Add testing section
  markdownReport += '## Testing Instructions\n\n';
  markdownReport += 'Please click each video link above to verify:\n\n';
  markdownReport += '1. ✅ Video loads and plays correctly\n';
  markdownReport += '2. ❌ Video shows "Video unavailable" (deleted/private)\n';
  markdownReport += '3. ❌ Video shows "This video isn\'t available anymore"\n';
  markdownReport += '4. ❌ Wrong exercise content\n\n';
  markdownReport += 'If you find any broken or incorrect videos, please note:\n';
  markdownReport += '- **Fitness Goal**\n';
  markdownReport += '- **Exercise Name**\n';
  markdownReport += '- **Video Number**\n';
  markdownReport += '- **Issue** (deleted/private/wrong content)\n';
  markdownReport += '- **Replacement Video ID** (optional)\n\n';

  // Save to file
  const reportPath = path.join(__dirname, 'VIDEO_REPORT.md');
  fs.writeFileSync(reportPath, markdownReport, 'utf8');

  console.log(`✅ Report generated successfully!`);
  console.log(`📄 File: ${reportPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - ${collections.length} Fitness Goals`);
  console.log(`   - ${totalExercises} Exercises`);
  console.log(`   - ${totalVideos} Videos`);
  console.log(`\n💡 Open VIDEO_REPORT.md to view all video links organized by fitness goal.`);
  console.log(`   Click each link to verify it works on YouTube.\n`);
}

db.once('open', async () => {
  try {
    await generateVideoReport();
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
