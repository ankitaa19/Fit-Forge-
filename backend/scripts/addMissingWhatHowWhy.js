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
    // Muscle Gain exercises missing what/how/why
    const muscleGainUpdates = [
      {
        title: 'Push Ups',
        what: 'A fundamental upper body exercise that targets the chest, shoulders, and triceps while engaging your core for stability.',
        why: 'Push ups build functional strength, improve posture, and can be done anywhere without equipment, making them perfect for building upper body muscle mass.',
        how: 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, keeping your core tight and back straight. Push back up to starting position.'
      },
      {
        title: 'Squats',
        what: 'A compound lower body exercise that primarily targets the quadriceps, glutes, and hamstrings while engaging your core and lower back.',
        why: 'Squats are the king of lower body exercises, building mass in your legs and glutes while improving overall athletic performance and functional strength.',
        how: 'Stand with feet shoulder-width apart, toes slightly turned out. Lower your hips back and down as if sitting in a chair, keeping chest up. Descend until thighs are parallel to the ground, then drive through heels to stand.'
      },
      {
        title: 'Lunges',
        what: 'A unilateral leg exercise that targets the quadriceps, glutes, and hamstrings while improving balance and coordination.',
        why: 'Lunges help correct muscle imbalances between legs, improve stability, and build functional strength that translates to everyday movements and athletic performance.',
        how: 'Step forward with one leg, lowering your hips until both knees are bent at 90-degree angles. The back knee should nearly touch the ground. Push through the front heel to return to standing.'
      },
      {
        title: 'Chair Dips',
        what: 'A bodyweight exercise that primarily targets the triceps, with secondary emphasis on chest and shoulders.',
        why: 'Chair dips are excellent for building tricep mass and upper body pushing strength, helping create well-defined arms without needing gym equipment.',
        how: 'Place hands on the edge of a sturdy chair behind you, fingers pointing forward. Extend legs in front with heels on ground. Lower body by bending elbows until upper arms are parallel to ground, then push back up.'
      },
      {
        title: 'Pike Push Ups',
        what: 'An advanced shoulder-focused exercise that mimics the overhead pressing movement using your bodyweight.',
        why: 'Pike push ups specifically target the shoulders for building mass and strength in the deltoids, preparing you for advanced exercises like handstand push ups.',
        how: 'Start in downward dog position with hips high, forming an inverted V with your body. Bend elbows to lower your head toward the ground, then press back up, keeping hips elevated throughout.'
      },
      {
        title: 'Decline Push Ups',
        what: 'An elevated variation of push ups where your feet are raised, shifting more emphasis to the upper chest and shoulders.',
        why: 'Decline push ups increase the difficulty and load on your upper chest and shoulders, promoting greater muscle growth in these areas compared to regular push ups.',
        how: 'Place your feet on an elevated surface like a bench or chair. Get into push up position with hands on the ground. Perform push ups while maintaining the elevated position, focusing on controlled movement.'
      },
      {
        title: 'Reverse Lunges',
        what: 'A backward-stepping lunge variation that targets the quads, glutes, and hamstrings with less stress on the knees.',
        why: 'Reverse lunges are gentler on the knees while still building significant leg and glute mass, making them ideal for those with knee sensitivities or for higher-volume training.',
        how: 'From standing position, step one foot backwards and lower your body until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle. Push through the front leg to return to standing.'
      },
      {
        title: 'Hip Thrusts',
        what: 'A glute-dominant exercise performed with your upper back elevated, thrusting your hips upward against gravity.',
        why: 'Hip thrusts are one of the most effective exercises for building and strengthening the glutes, improving posterior chain development and athletic power.',
        how: 'Sit on the ground with your upper back against a bench. Drive through your heels to lift your hips until your body forms a straight line from knees to shoulders. Squeeze glutes at the top, then lower with control.'
      },
      {
        title: 'Step Ups with Knee Drive',
        what: 'A dynamic single-leg exercise that combines stepping onto an elevated surface with an explosive knee drive.',
        why: 'This exercise builds leg power and mass while improving balance and hip flexor strength, translating to better athletic performance and functional movement.',
        how: 'Place one foot on a sturdy elevated platform. Step up by driving through that foot, and as you rise, explosively drive the other knee up toward your chest. Step back down with control and repeat.'
      },
      {
        title: 'Calf Raises',
        what: 'An isolation exercise that specifically targets the gastrocnemius and soleus muscles of the calves.',
        why: 'Calf raises build lower leg strength and mass, improving ankle stability and completing balanced leg development, which is often neglected in many training programs.',
        how: 'Stand with feet hip-width apart, optionally on an elevated surface with heels hanging off. Rise up onto the balls of your feet as high as possible, pause at the top, then lower slowly back down.'
      },
      {
        title: 'Isometric Hold Squats',
        what: 'A static hold variation of the squat where you maintain a fixed position at the bottom of the squat.',
        why: 'Isometric squats build incredible leg endurance and mental toughness while improving strength at the most difficult part of the squat movement, leading to better overall squat performance.',
        how: 'Lower into a squat position with thighs parallel to the ground. Hold this position without moving, keeping weight in your heels and chest up. Focus on breathing steadily throughout the hold.'
      }
    ];

    // Core Strength exercises missing what/how/why
    const coreStrengthUpdates = [
      {
        title: 'Bicycle Crunch',
        what: 'A dynamic ab exercise that alternates twisting motions while bringing opposite elbow to knee, mimicking a bicycle pedaling motion.',
        why: 'Bicycle crunches effectively target both the upper and lower abs while engaging the obliques, making them one of the most comprehensive core exercises for a defined midsection.',
        how: 'Lie on your back with hands behind head. Lift shoulder blades off ground and bring one knee toward chest while twisting opposite elbow to meet it. Alternate sides in a controlled, fluid motion.'
      },
      {
        title: 'Toe Touches',
        what: 'An abdominal exercise where you reach your hands toward your toes while lying on your back, targeting the upper abs.',
        why: 'Toe touches isolate the upper abdominals and improve hip flexor flexibility, contributing to a stronger, more defined core and better overall posture.',
        how: 'Lie flat on your back with legs extended straight up toward the ceiling. Lift your shoulder blades off the ground and reach your hands toward your toes, engaging your upper abs. Lower back down with control.'
      },
      {
        title: 'Dead Bug Exercise',
        what: 'A core stabilization exercise performed on your back, extending opposite arm and leg while keeping your core engaged.',
        why: 'Dead bugs improve core stability, coordination, and lower back health by teaching proper core engagement and anti-extension strength, essential for injury prevention.',
        how: 'Lie on your back with arms extended toward ceiling and knees bent at 90 degrees. Slowly extend opposite arm and leg while keeping lower back pressed to floor. Return to start and alternate sides.'
      },
      {
        title: 'Reverse Crunch',
        what: 'A lower abdominal exercise where you lift your hips off the ground by contracting your abs, rather than lifting your upper body.',
        why: 'Reverse crunches specifically target the often-neglected lower abs, helping create a complete six-pack appearance and improving lower core strength.',
        how: 'Lie on your back with knees bent and feet lifted. Contract your abs to curl your hips off the ground, bringing knees toward chest. Focus on using abs, not momentum, to lift. Lower back down with control.'
      },
      {
        title: 'Heel Taps',
        what: 'An oblique-focused exercise where you alternately reach your hands to tap your heels while maintaining a crunch position.',
        why: 'Heel taps target the obliques and help create definition along the sides of your waist, contributing to a sculpted, athletic-looking midsection.',
        how: 'Lie on your back with knees bent and feet flat. Lift shoulders off ground slightly. Reach one hand down to tap the same-side heel, engaging your obliques. Alternate sides in a controlled manner.'
      },
      {
        title: 'Plank Shoulder Taps',
        what: 'A dynamic plank variation where you alternately lift your hands to tap opposite shoulders while maintaining a stable core.',
        why: 'Plank shoulder taps build core stability and anti-rotation strength while also engaging your shoulders, making them excellent for functional core strength and balance.',
        how: 'Start in a high plank position with feet slightly wider than hip-width for stability. Lift one hand to tap opposite shoulder while keeping hips level and still. Alternate sides, resisting rotation.'
      }
    ];

    // Update Muscle Gain exercises
    console.log('=== Updating Muscle Gain Exercises ===');
    const muscleGainCollection = db.collection('musclegain');
    let muscleGainCount = 0;
    for (const update of muscleGainUpdates) {
      const result = await muscleGainCollection.updateOne(
        { title: update.title },
        { $set: { what: update.what, why: update.why, how: update.how } }
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated: ${update.title}`);
        muscleGainCount++;
      } else {
        console.log(`⚠️  Not found or already updated: ${update.title}`);
      }
    }
    console.log(`\nUpdated ${muscleGainCount} Muscle Gain exercises\n`);

    // Update Core Strength exercises
    console.log('=== Updating Core Strength Exercises ===');
    const coreStrengthCollection = db.collection('corestrength');
    let coreStrengthCount = 0;
    for (const update of coreStrengthUpdates) {
      const result = await coreStrengthCollection.updateOne(
        { title: update.title },
        { $set: { what: update.what, why: update.why, how: update.how } }
      );
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated: ${update.title}`);
        coreStrengthCount++;
      } else {
        console.log(`⚠️  Not found or already updated: ${update.title}`);
      }
    }
    console.log(`\nUpdated ${coreStrengthCount} Core Strength exercises\n`);

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total exercises updated: ${muscleGainCount + coreStrengthCount}`);
    console.log(`✅ Muscle Gain: ${muscleGainCount}`);
    console.log(`✅ Core Strength: ${coreStrengthCount}`);

  } catch (error) {
    console.error('Error updating exercises:', error);
  }

  await mongoose.connection.close();
  process.exit(0);
});
