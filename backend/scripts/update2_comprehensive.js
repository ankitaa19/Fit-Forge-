const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fitforge');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');
  console.log('==============================================');
  console.log('COMPREHENSIVE GOAL-ORIENTED DESCRIPTION UPDATE');
  console.log('==============================================\n');

  let totalUpdated = 0;

  try {
    // Continue updating Weight Loss with correct titles
    console.log('=== WEIGHT LOSS (Additional Exercises) ===');
    const weightLossAdditional = [
      {
        title: 'Jump Rope',
        what: 'Jump Rope is a rhythmic cardio exercise where you jump over a rotating rope using coordinated timing.',
        why: 'Jump Rope is essential for weight loss because it burns calories at an extremely high rate (up to 10-16 calories per minute) while improving cardiovascular endurance.',
        how: 'The continuous jumping motion creates sustained calorie burn, improves coordination, and builds lean calf muscle that supports metabolism and accelerated fat loss.'
      },
      {
        title: 'Skater Jumps',
        what: 'Skater Jumps are a lateral plyometric exercise that mimics the side-to-side motion of speed skating with explosive power.',
        why: 'Skater Jumps are crucial for weight loss because they provide high-intensity cardio that burns significant calories while working often-neglected lateral leg muscles.',
        how: 'The explosive lateral movement elevates heart rate quickly, burns fat through intense effort, and builds lean leg muscle for a toned lower body and faster metabolism.'
      },
      {
        title: 'Running in Place',
        what: 'Running in Place is a stationary cardio exercise that replicates running motion without forward movement.',
        why: 'This exercise is important for weight loss because it provides accessible cardio that burns calories steadily without requiring space or equipment.',
        how: 'By maintaining a jogging pace in place, you sustain elevated heart rate for extended periods, burning calories consistently and improving cardiovascular fitness for weight loss.'
      },
      {
        title: 'Side Lunges',
        what: 'Side Lunges are a lateral leg exercise where you step to the side and bend one knee while keeping the other leg straight.',
        why: 'Side Lunges are valuable for weight loss because they target inner and outer thigh muscles while providing moderate cardio, helping tone legs and burn calories.',
        how: 'The lateral movement pattern engages multiple leg muscles including adductors and abductors, burning calories while sculpting lean, defined legs.'
      },
      {
        title: 'Jump Squats',
        what: 'Jump Squats are an explosive plyometric exercise combining a bodyweight squat with a powerful vertical jump.',
        why: 'Jump Squats are essential for weight loss because they combine strength and explosive cardio, burning massive calories while building metabolism-boosting leg muscle.',
        how: 'The explosive nature creates high caloric demands, elevates heart rate dramatically, and builds powerful legs that increase resting metabolic rate for faster fat loss.'
      },
      {
        title: 'Star Jumps',
        what: 'Star Jumps are an explosive full-body exercise where you jump and spread your limbs wide to form a star shape in the air.',
        why: 'Star Jumps are crucial for weight loss because they provide maximum-intensity cardio that engages every major muscle group, burning calories at an accelerated rate.',
        how: 'The full-body explosive movement creates substantial calorie expenditure, elevates heart rate maximally, and builds overall athleticism while accelerating fat loss.'
      },
      {
        title: 'Fast Feet Drill',
        what: 'Fast Feet Drill is a high-intensity agility exercise where you rapidly tap your feet up and down in place as  fast as possible.',
        why: 'Fast Feet Drill is vital for weight loss because it spikes heart rate immediately, burns calories rapidly, and improves speed and agility while shedding fat.',
        how: 'The extremely rapid foot movement creates intense caloric demands, improves cardiovascular fitness, and builds lean calf and ankle muscles that support weight loss.'
      }
    ];

    const wlCol = db.collection('weightloss');
    for (const update of weightLossAdditional) {
      const result = await wlCol.updateOne(
        { title: update.title },
        { $set: { what: update.what, why: update.why, how: update.how } }
      );
      if (result.matchedCount > 0) {
        console.log(`✅ ${update.title}`);
        totalUpdated++;
      }
    }
    console.log(`Updated ${weightLossAdditional.length} more Weight Loss exercises\n`);

    // ============================================================================
    // MUSCLE GAIN COLLECTION - Focus: Building muscle mass and strength
    // ============================================================================
    console.log('=== MUSCLE GAIN ===');
    const muscleGainUpdates = [
      {
        title: 'Push Ups',
        what: 'Push Ups are a compound upper body exercise where you lower and raise your body in a plank position using your arms.',
        why: 'Push Ups are essential for muscle gain because they effectively overload the chest, shoulders, and triceps, stimulating muscle fiber growth and strength development.',
        how: 'Through progressive overload and proper form, push ups create micro-tears in muscle tissue that repair larger and stronger, directly building upper body mass and definition.'
      },
      {
        title: 'Squats',
        what: 'Squats are a fundamental compound exercise where you lower your hips from standing and rise back up, loading the entire lower body.',
        why: 'Squats are crucial for muscle gain because they target the largest muscle groups (quads, glutes, hamstrings), triggering maximum anabolic hormone release for full-body growth.',
        how: 'The heavy compound loading creates significant muscle damage and metabolic stress in leg muscles, key drivers of hypertrophy that lead to substantial lower body mass development.'
      },
      {
        title: 'Lunges',
        what: 'Lunges are a unilateral leg exercise performed by stepping forward or backward and lowering your back knee toward the ground.',
        why: 'Lunges are important for muscle gain because they isolate each leg individually, ensuring balanced development and preventing strength imbalances that limit overall growth.',
        how: 'The unilateral loading increases time under tension for each leg, forces better muscle fiber recruitment, and creates the mechanical stress needed for significant muscle hypertrophy.'
      },
      {
        title: 'Glute Bridge',
        what: 'Glute Bridge is a posterior chain exercise where you lie on your back and thrust your hips upward to create a straight line from knees to shoulders.',
        why: 'Glute Bridges are essential for muscle gain because they isolate and overload the glutes and hamstrings, building impressive size and strength in these key muscle groups.',
        how: 'The targeted hip extension movement creates intense tension specifically in glutes and hamstrings, driving muscle growth in the posterior chain for powerful, muscular legs.'
      },
      {
        title: 'Wall Sit',
        what: 'Wall Sit is an isometric leg exercise where you hold a seated position against a wall with thighs parallel to the ground.',
        why: 'Wall Sits are valuable for muscle gain because they create sustained tension in quads and glutes, building muscular endurance and triggering growth through time under tension.',
        how: 'The isometric hold forces muscle fibers to work continuously without rest, creating metabolic stress and muscle fiber recruitment that contributes to leg muscle development.'
      },
      {
        title: 'Chair Dips',
        what: 'Chair Dips are a bodyweight triceps exercise performed by lowering and raising your body using a stable elevated surface behind you.',
        why: 'Chair Dips are crucial for muscle gain because they effectively isolate and overload the triceps, building arm mass and completing balanced upper body development.',
        how: 'The focused triceps loading creates muscle fiber breakdown and rebuilding in the arms, leading to larger, stronger triceps that enhance overall arm size and definition.'
      },
      {
        title: 'Bulgarian Split Squats',
        what: 'Bulgarian Split Squats are an advanced single-leg squat variation performed with the rear foot elevated on a bench or platform.',
        why: 'Bulgarian Split Squats  are essential for muscle gain because the elevated rear leg increases load on the  working leg, creating superior muscle-building stimulus.',
        how: 'The challenging unilateral position forces maximum muscle fiber recruitment in quads and glutes, creating the mechanical tension and metabolic stress needed for significant hypertrophy.'
      },
      {
        title: 'Pike Push Ups',
        what: 'Pike Push Ups are a shoulder-focused push up variation performed with hips elevated in an inverted V position.',
        why: 'Pike Push Ups are important for muscle gain because they specifically target the shoulders with progressive overload, building impressive deltoid size and strength.',
        how: 'The vertical pressing angle shifts maximum load to shoulder muscles, creating the muscle damage and tension required for developing strong, well-defined deltoids.'
      },
      {
        title: 'Decline Push Ups',
        what: 'Decline Push Ups are a push up variation performed with feet elevated, increasing the difficulty and upper chest emphasis.',
        why: 'Decline Push Ups are crucial for muscle gain because the elevation increases load on upper chest and shoulders, promoting balanced, full chest development.',
        how: 'The modified angle creates greater mechanical tension in upper pecs and front deltoids, stimulating muscle growth in these  areas for a complete, muscular upper body.'
      },
      {
        title: 'Pistol Squats',
        what: 'Pistol Squats are an advanced single-leg squat where you descend on one leg while extending the other leg forward.',
        why: 'Pistol Squats are vital for muscle gain because they require maximum strength and stability from one leg, creating superior muscle-building stimulus through extreme loading.',
        how: 'The single-leg requirement forces near-maximal muscle fiber recruitment and creates significant mechanical tension, driving impressive strength and size gains in legs.'
      },
      {
        title: 'Reverse Lunges',
        what: 'Reverse Lunges are a leg exercise performed by stepping backward and lowering your body, then returning to standing.',
        why: 'Reverse Lunges are important for muscle gain because they emphasize glutes heavily while being knee-friendly, allowing for high-volume training that builds leg mass.',
        how: 'The backward stepping motion maximizes glute activation and time under tension, creating the metabolic and mechanical stress needed for building powerful, muscular legs.'
      },
      {
        title: 'Hip Thrusts',
        what: 'Hip Thrusts are a glute-dominant exercise performed with upper back on a bench, thrusting hips upward against resistance.',
        why: 'Hip Thrusts are essential for muscle gain because they allow maximum loading of glutes through full range, making them the top exercise for building gluteal mass.',
        how: 'The direct glute loading through hip extension creates optimal muscle fiber recruitment and tension, driving maximum hypertrophy in the glutes for size and strength.'
      },
      {
        title: 'Step Ups with Knee Drive',
        what: 'Step Ups with Knee Drive are a dynamic single-leg exercise combining stepping onto elevation with explosive knee drive at the top.',
        why: 'This exercise is valuable for muscle gain because it combines strength and power training, building explosive leg muscle while addressing balance and coordination.',
        how: 'The combination of controlled stepping and explosive knee drive creates varied stimulus that promotes muscle growth while improving athletic power output.'
      },
      {
        title: 'Calf Raises',
        what: 'Calf Raises are an isolation exercise where you rise up onto the balls of your feet, targeting the calf muscles specifically.',
        why: 'Calf Raises are crucial for muscle gain because they directly isolate and overload the gastrocnemius and soleus, building defined, muscular calves.',
        how: 'The focused calf contraction through full range creates the muscle tension and training volume needed to develop larger, stronger, more defined calf muscles.'
      },
      {
        title: 'Isometric Hold Squats',
        what: 'Isometric Hold Squats involve holding a squat position at a specific depth without movement for an extended duration.',
        why: 'Isometric squats are important for muscle gain because they create continuous tension in leg muscles, building strength at sticking points and enhancing overall muscle development.',
        how: 'The sustained isometric contraction forces prolonged muscle fiber activation and metabolic stress, contributing to both strength gains and muscle hypertrophy in legs.'
      }
    ];

    const mgCol = db.collection('musclegain');
    for (const update of muscleGainUpdates) {
      const result = await mgCol.updateOne(
        { title: update.title },
        { $set: { what: update.what, why: update.why, how: update.how } }
      );
      if (result.matchedCount > 0) {
        console.log(`✅ ${update.title}`);
        totalUpdated++;
      }
    }
    console.log(`Updated ${muscleGainUpdates.length} Muscle Gain exercises\n`);

    console.log(`\n${'='.repeat(50)}`);
    console.log(`TOTAL EXERCISES UPDATED SO FAR: ${totalUpdated}`);
    console.log(`${'='.repeat(50)}\n`);
    console.log('Continue with remaining collections...\n');

  } catch (error) {
    console.error('Error:', error);
  }

  await mongoose.connection.close();
  process.exit(0);
});
