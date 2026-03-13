const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fitforge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Function to extract video ID from YouTube URL
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

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');

  const collections = [
    { name: 'weightloss', displayName: 'Weight Loss', goal: 'weight loss and calorie burning' },
    { name: 'musclegain', displayName: 'Muscle Gain', goal: 'building muscle mass and strength' },
    { name: ' corestrength', displayName: 'Core Strength', goal: 'building core stability and strength' },
    { name: 'flexibilitymobilities', displayName: 'Flexibility & Mobility', goal: 'improving flexibility and range of motion' },
    { name: 'endurances', displayName: 'Endurance', goal: 'building cardiovascular endurance and stamina' },
    { name: 'generalfitnesses', displayName: 'General Fitness', goal: 'overall fitness and health' },
  ];

  const updates = {
    weightloss: [
      {
        title: 'Jumping Jacks',
        what: 'Jumping Jacks are a full-body cardiovascular exercise that involves jumping while spreading your legs and raising your arms overhead.',
        why: 'This exercise is crucial for weight loss because it elevates your heart rate quickly, burns calories efficiently, and engages multiple muscle groups simultaneously to maximize calorie expenditure.',
        how: 'By performing high-repetition Jumping Jacks, you create an aerobic effect that boosts metabolism, increases fat burning, and contributes to the calorie deficit needed for weight loss.'
      },
      {
        title: 'Burpees',
        what: 'Burpees are a high-intensity compound exercise combining a squat, plank, push-up, and jump into one continuous movement.',
        why: 'Burpees are essential for weight loss because they burn massive calories in a short time, spike your heart rate, and create an afterburn effect that continues burning calories even after exercise.',
        how: 'The explosive, full-body nature of burpees maximizes calorie burn while building lean muscle that increases your resting metabolic rate, helping you lose weight faster and more effectively.'
      },
      {
        title: 'Mountain Climbers',
        what: 'Mountain Climbers are a dynamic cardio exercise performed in a plank position, alternating bringing knees toward your chest in a running motion.',
        why: 'This exercise is vital for weight loss because it combines cardio and core work, burning significant calories while strengthening your midsection and improving cardiovascular fitness.',
        how: 'Mountain Climbers accelerate fat loss by maintaining an elevated heart rate, engaging your core muscles continuously, and creating metabolic demands that burn calories both during and after your workout.'
      },
      {
        title: 'High Knees',
        what: 'High Knees is a running-in-place cardio exercise where you lift your knees to hip level at a rapid pace while pumping your arms.',
        why: 'High Knees are important for weight loss because they rapidly elevate heart rate, burn calories quickly, and improve leg strength while maintaining continuous calorie-burning cardiovascular activity.',
        how: 'This exercise helps achieve weight loss by combining intense lower body work with sustained cardio effort, creating a high-calorie burn that contributes directly to fat loss and improved fitness.'
      },
      {
        title: 'Squat Jumps',
        what: 'Squat Jumps are a plyometric exercise combining a bodyweight squat with an explosive vertical jump.',
        why: 'Squat Jumps are crucial for weight loss because they combine strength training with explosive cardio, burning significant calories while building lean leg muscle that increases metabolism.',
        how: 'The high-intensity nature of Squat Jumps creates a substantial calorie burn, elevates heart rate, and builds muscle mass that continues burning calories at rest, accelerating weight loss results.'
      },
      {
        title: 'Step Touch Cardio',
        what: 'Step Touch Cardio is a simple side-to-side stepping movement that provides continuous cardiovascular activity at a moderate intensity.',
        why: 'This exercise is important for weight loss because it offers sustainable low-impact cardio that burns calories steadily, making it perfect for longer duration fat-burning sessions.',
        how: 'Step Touch helps achieve weight loss by maintaining your heart rate in the fat-burning zone for extended periods, allowing you to burn calories consistently without excessive fatigue.'
      },
      {
        title: 'Plank Jacks',
        what: 'Plank Jacks are a core-focused cardio exercise performed in a plank position while jumping your feet in and out.',
        why: 'Plank Jacks are essential for weight loss because they combine core strengthening with cardiovascular work, burning calories while building a strong, defined midsection.',
        how: 'This exercise contributes to weight loss by engaging your entire core while maintaining elevated heart rate, creating a dual benefit of calorie burn and muscle toning for a leaner physique.'
      },
      {
        title: 'Butt Kicks',
        what: 'Butt Kicks are a cardio exercise where you run in place while kicking your heels up toward your glutes.',
        why: 'Butt Kicks are important for weight loss because they provide intense cardio that burns calories rapidly while strengthening hamstrings and improving running form for better overall fitness.',
        how: 'By maintaining a fast pace with Butt Kicks, you elevate your metabolism, burn significant calories, and build lean leg muscle that supports long-term weight loss and improved body composition.'
      },
      {
        title: 'Skaters',
        what: 'Skaters are a lateral jumping exercise that mimics the side-to-side motion of speed skating.',
        why: 'Skaters are crucial for weight loss because they provide high-intensity lateral cardio that burns calories, improves balance, and engages often-neglected lateral muscles.',
        how: 'The explosive side-to-side movement of Skaters creates high calorie expenditure, builds leg strength, and improves agility while contributing to overall fat loss and athletic development.'
      },
      {
        title: 'Jumping Lunges',
        what: 'Jumping Lunges are a plyometric exercise alternating between lunge positions with an explosive jump between each rep.',
        why: 'Jumping Lunges are essential for weight loss because they combine lower body strength work with explosive cardio, creating maximum calorie burn and building lean muscle mass.',
        how: 'This exercise accelerates weight loss by demanding significant energy from your legs and cardiovascular system, burning calories intensely while sculpting strong, defined legs and glutes.'
      },
      {
        title: 'Speed Skaters',
        what: 'Speed Skaters are a dynamic lateral movement exercise involving explosive side-to-side jumps while maintaining a slight crouch.',
        why: 'Speed Skaters are vital for weight loss because they provide intense interval-style cardio that maximizes calorie burn while improving lateral strength and cardiovascular fitness.',
        how: 'The high-intensity nature of Speed Skaters creates substantial metabolic demands, burning calories rapidly and building lean muscle that supports sustained weight loss efforts.'
      },
      {
        title: 'Tuck Jumps',
        what: 'Tuck Jumps are an explosive plyometric exercise where you jump vertically while bringing your knees toward your chest at the peak.',
        why: 'Tuck Jumps are crucial for weight loss because they provide maximum intensity cardio that burns calories at an extremely high rate while building explosive power and leg strength.',
        how: 'This exercise contributes to weight loss through intense calorie expenditure, elevated heart rate, and the afterburn effect that continues burning calories long after your workout ends.'
      },
      {
        title: 'Invisible Jump Rope',
        what: 'Invisible Jump Rope mimics the movement of jumping rope without actual equipment, maintaining the same footwork and arm motions.',
        why: 'This exercise is important for weight loss because it provides sustained cardiovascular activity that burns calories consistently while being accessible anywhere without equipment.',
        how: 'Invisible Jump Rope helps achieve weight loss by maintaining your heart rate in an optimal fat-burning zone, allowing for extended cardio sessions that maximize calorie expenditure.'
      },
      {
        title: 'Power Jacks',
        what: 'Power Jacks are an amplified version of jumping jacks performed with greater intensity, power, and range of motion.',
        why: 'Power Jacks are essential for weight loss because they dramatically elevate heart rate and calorie burn through explosive full-body movements that engage all major muscle groups.',
        how: 'The powerful, maximal-effort nature of Power Jacks creates superior calorie burn compared to standard cardio, accelerating fat loss while building cardiovascular endurance.'
      },
      {
        title: 'Punches',
        what: 'Punches are boxing-inspired movements involving rapid alternating forward strikes with proper technique and form.',
        why: 'Punches are valuable for weight loss because they provide high-intensity upper body cardio that burns calories while toning arms, shoulders, and core.',
        how: 'Rapid punching movements elevate heart rate significantly, burn calories through continuous motion, and build lean muscle in the upper body that supports overall metabolism and weight loss.'
      }
    ],
    musclegain: [
      // Already updated in previous script, but let's make them more goal-specific
      {
        title: 'Push Ups',
        what: 'Push Ups are a fundamental compound exercise performed in a plank position, lowering and raising your body using your arms.',
        why: 'Push Ups are essential for muscle gain because they effectively target the chest, shoulders, and triceps with progressive overload, stimulating muscle growth without equipment.',
        how: 'By performing push ups with proper form and increasing repetitions or difficulty, you create micro-tears in muscle fibers that repair larger and stronger, directly building upper body mass.'
      },
      {
        title: 'Squats',
        what: 'Squats are a compound lower body exercise where you lower your hips from a standing position and then stand back up.',
        why: 'Squats are crucial for muscle gain because they target the largest muscle groups in your body (quads, glutes, hamstrings), triggering maximum testosterone release and overall muscle growth.',
        how: 'The heavy loading and compound nature of squats create significant muscle damage and metabolic stress, key drivers of hypertrophy that lead to substantial leg and full-body muscle development.'
      },
      {
        title: 'Lunges',
        what: 'Lunges are a unilateral leg exercise performed by stepping forward and lowering your back knee toward the ground.',
        why: 'Lunges are important for muscle gain because they allow focused work on each leg individually, creating balanced muscle development and addressing strength imbalances that limit growth.',
        how: 'The unilateral nature of lunges increases time under tension for each leg, forces better muscle recruitment, and allows progressive overload that stimulates muscle fiber growth and strength gains.'
      },
      // Continue with rest...
    ],
    // Continue with other collections...
  };

  console.log('Starting to update exercise descriptions...\n');

  // Update Weight Loss collection
  console.log('=== UPDATING WEIGHT LOSS EXERCISES ===');
  const weightLossCollection = db.collection('weightloss');
  let weightLossCount = 0;
  for (const update of updates.weightloss) {
    const result = await weightLossCollection.updateOne(
      { title: update.title },
      { $set: { what: update.what, why: update.why, how: update.how } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✅ Updated: ${update.title}`);
      weightLossCount++;
    }
  }
  console.log(`\nUpdated ${weightLossCount} Weight Loss exercises\n`);

  await mongoose.connection.close();
  process.exit(0);
});
