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

  const motivationalContent = {
    // MuscleGain - 11 missing
    'Push Ups': {
      what: 'Upper body compound exercise using bodyweight to press away from the ground',
      why: 'Builds chest, shoulders, and triceps strength while engaging core for stability and functional fitness',
      how: 'Start in plank position hands shoulder-width, lower chest to ground keeping body straight, push back up maintaining core tension'
    },
    'Squats': {
      what: 'Fundamental lower body compound movement bending at hips and knees',
      why: 'Builds leg and glute strength, burns calories efficiently, and improves functional movement for daily activities',
      how: 'Stand feet shoulder-width, sit back and down keeping knees aligned with toes, lower until thighs parallel, drive through heels to stand'
    },
    'Lunges': {
      what: 'Single-leg strengthening exercise stepping forward into a split squat position',
      why: 'Develops unilateral leg strength, improves balance, targets glutes and quads, and corrects muscle imbalances',
      how: 'Step forward into lunge with both knees at 90 degrees, keep front knee over ankle, drive through front heel to return to start'
    },
    'Chair Dips': {
      what: 'Tricep-focused bodyweight exercise using a chair or bench for support',
      why: 'Isolates and strengthens triceps, builds arm definition, and improves upper body pushing strength',
      how: 'Hands on chair edge behind you, lower body by bending elbows to 90 degrees, keep elbows back, press back up to start'
    },
    'Pike Push Ups': {
      what: 'Modified push-up with hips elevated forming an inverted V position',
      why: 'Targets shoulders more than regular push-ups, builds overhead pressing strength, and prepares for handstand progressions',
      how: 'Start in downward dog position, bend elbows lowering head toward ground between hands, press back up maintaining pike position'
    },
    'Decline Push Ups': {
      what: 'Push-up variation with feet elevated on a platform or bench',
      why: 'Increases resistance on upper chest and shoulders, builds advanced pushing strength, and adds progression challenge',
      how: 'Place feet on elevated surface hands on ground, perform push-up with more weight shifted toward upper body, maintain straight body line'
    },
    'Reverse Lunges': {
      what: 'Lunge variation stepping backward instead of forward',
      why: 'Easier on knees than forward lunges, builds leg strength, improves balance, and emphasizes glute activation',
      how: 'Step one leg back into lunge position, lower back knee toward ground, keep front shin vertical, push through front heel to return'
    },
    'Hip Thrusts': {
      what: 'Glute isolation exercise thrusting hips upward from a bridge position',
      why: 'Maximally activates glutes, builds hip extension strength, improves athletic power, and shapes posterior chain',
      how: 'Shoulders on bench or ground, feet flat hip-width apart, drive through heels lifting hips up, squeeze glutes at top, lower with control'
    },
    'Step Ups with Knee Drive': {
      what: 'Dynamic stepping exercise adding explosive knee drive at the top',
      why: 'Builds unilateral leg power, improves coordination, develops explosive strength, and enhances athletic performance',
      how: 'Step onto elevated surface, drive opposite knee up forcefully at top, control descent, alternate legs maintaining rhythm'
    },
    'Calf Raises': {
      what: 'Lower leg isolation exercise rising onto toes',
      why: 'Strengthens calf muscles, improves ankle stability, enhances jumping ability, and balances lower leg development',
      how: 'Stand on balls of feet on edge if possible, rise up onto toes as high as you can, pause at top, lower with control'
    },
    'Isometric Hold Squats': {
      what: 'Static squat position held without movement at a specific depth',
      why: 'Builds muscular endurance, mental toughness, strengthens stabilizer muscles, and improves squat position awareness',
      how: 'Squat down to desired depth usually 90 degrees, hold position maintaining tension, keep chest up and weight in heels throughout hold'
    },

    // CoreStrength - 6 missing
    'Bicycle Crunch': {
      what: 'Dynamic ab exercise rotating torso bringing opposite elbow to knee',
      why: 'Targets both rectus abdominis and obliques, improves rotational core strength, and burns more calories than static crunches',
      how: 'Lie on back hands behind head, bring opposite elbow to opposite knee while extending other leg, alternate sides in cycling motion'
    },
    'Toe Touches': {
      what: 'Upper ab exercise reaching hands toward toes in supine position',
      why: 'Isolates upper abdominals, improves core flexion strength, and provides intense contraction at movement peak',
      how: 'Lie on back legs straight up, reach hands toward toes lifting shoulder blades off ground, lower with control and repeat'
    },
    'Dead Bug Exercise': {
      what: 'Anti-extension core stabilization drill alternating opposite arm and leg',
      why: 'Teaches core stability, prevents lower back arching, improves coordination, and builds functional core strength',
      how: 'Lie on back arms up legs tabletop, lower opposite arm and leg maintaining back contact with floor, alternate sides with control'
    },
    'Reverse Crunch': {
      what: 'Lower ab exercise lifting hips and legs toward chest',
      why: 'Specifically targets lower abs, reduces hip flexor involvement, and provides safer alternative to leg raises',
      how: 'Lie on back knees bent, use abs to lift hips and pull knees toward chest, avoid momentum, lower with control'
    },
    'Heel Taps': {
      what: 'Oblique exercise alternately reaching hands to heels in side crunching motion',
      why: 'Isolates oblique muscles, improves side core strength, enhances waist definition, and builds lateral stability',
      how: 'Lie on back knees bent feet flat, crunch to side reaching hand toward same-side heel, alternate sides maintaining tension'
    },
    'Plank Shoulder Taps': {
      what: 'Anti-rotation plank variation alternately tapping opposite shoulder',
      why: 'Challenges core stability dynamically, improves anti-rotation strength, builds shoulder stability, and engages entire core',
      how: 'Hold plank position, tap one hand to opposite shoulder while minimizing hip rotation, alternate sides maintaining stable torso'
    }
  };

  try {
    let updatedCount = 0;

    // Update MuscleGain
    const muscleCollection = db.collection('musclegain');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const result = await muscleCollection.updateOne(
        { title: title },
        { $set: content }
      );
      if (result.matchedCount > 0) {
        console.log(`✅ Updated ${title}`);
        updatedCount++;
      }
    }

    // Update CoreStrength
    const coreCollection = db.collection('corestrength');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const result = await coreCollection.updateOne(
        { title: title },
        { $set: content }
      );
      if (result.matchedCount > 0) {
        console.log(`✅ Updated ${title}`);
        updatedCount++;
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} exercises with motivational content`);

  } catch (error) {
    console.error('❌ Error updating exercises:', error);
  }

  await mongoose.connection.close();
  process.exit(0);
});
