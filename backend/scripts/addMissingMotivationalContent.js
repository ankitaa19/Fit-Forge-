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
    // FlexibilityMobilities - 8 missing
    'Cat Cow Stretch': {
      what: 'Dynamic spinal flexion and extension movement alternating between two positions',
      why: 'Improves spine flexibility, relieves back tension, and prepares your body for deeper stretches',
      how: 'Start on hands and knees, arch your back while looking up (cow), then round your spine while tucking chin (cat), moving smoothly between positions'
    },
    'Standing Quad Stretch': {
      what: 'Standing balance exercise targeting the front thigh muscles',
      why: 'Lengthens tight quadriceps, improves hip flexibility, and helps prevent knee pain from muscle imbalance',
      how: 'Stand on one leg, pull your other foot toward your glutes, keep knees together, and hold the stretch feeling it in your front thigh'
    },
    'Shoulder Stretch': {
      what: 'Upper body stretch targeting the shoulder joint and surrounding muscles',
      why: 'Releases shoulder tension, increases range of motion, and counters effects of prolonged sitting and computer work',
      how: 'Pull one arm across your chest using your other arm, keep shoulders relaxed, and feel the stretch in the back of your shoulder'
    },
    'Neck Stretch': {
      what: 'Gentle cervical spine stretch targeting neck and upper trapezius muscles',
      why: 'Relieves neck stiffness, reduces headache tension, and counteracts forward head posture from screen time',
      how: 'Tilt your head to one side bringing ear toward shoulder, use gentle hand pressure if needed, keep opposite shoulder down and relaxed'
    },
    'Spinal Twist Stretch': {
      what: 'Rotational spine stretch improving mobility in the thoracic and lumbar regions',
      why: 'Enhances spinal rotation, aids digestion, releases lower back tension, and maintains healthy disc function',
      how: 'Sit or lie down, rotate your torso to one side while keeping hips stable, use your arms to gently deepen the twist, breathe into the stretch'
    },
    'Knee to Chest Stretch': {
      what: 'Supine stretch bringing one or both knees toward the chest',
      why: 'Releases lower back tightness, stretches glutes and hamstrings, and provides gentle compression for digestive benefits',
      how: 'Lie on your back, hug one or both knees to your chest, keep your lower back pressed to the floor, and hold while breathing deeply'
    },
    'Side Stretch': {
      what: 'Lateral flexion movement stretching the muscles along the sides of your torso',
      why: 'Opens up the intercostal muscles, improves breathing capacity, releases oblique tension, and balances spine alignment',
      how: 'Stand or sit tall, reach one arm overhead and lean to the opposite side, keep hips stable, and feel the stretch along your side body'
    },
    'Lunge Stretch': {
      what: 'Hip flexor and quad stretch performed in a kneeling or standing lunge position',
      why: 'Counteracts hip tightness from sitting, improves hip mobility, and prepares legs for explosive movements',
      how: 'Step into a lunge position, drop your back knee down if needed, push hips forward while keeping chest upright, and feel the stretch in your front hip'
    },

    // Endurances - 6 missing
    'Cycling Simulation': {
      what: 'Indoor cardio exercise mimicking the motion and intensity of outdoor cycling',
      why: 'Builds cardiovascular endurance, strengthens legs with low joint impact, and burns significant calories efficiently',
      how: 'Use a stationary bike or cycling motion, maintain steady cadence, adjust resistance for intensity, and keep core engaged throughout'
    },
    'Speed Squats': {
      what: 'Rapid repetition bodyweight squats performed at an accelerated tempo',
      why: 'Develops lower body power endurance, elevates heart rate quickly, and improves muscular stamina in legs and glutes',
      how: 'Stand with feet shoulder-width, squat down quickly while maintaining form, explode up fast, and keep continuous movement for the set duration'
    },
    'Box Step Runs': {
      what: 'Dynamic stepping exercise alternating feet on an elevated platform at running pace',
      why: 'Combines cardio with lower body strength, burns calories efficiently, and improves coordination and agility',
      how: 'Face a sturdy box or step, rapidly alternate stepping up with each foot, maintain quick tempo, and keep arms pumping naturally'
    },
    'Lateral Shuffle': {
      what: 'Side-to-side shuffling movement maintaining athletic stance throughout',
      why: 'Builds lateral agility, strengthens hip stabilizers, improves sports performance, and enhances side-to-side movement efficiency',
      how: 'Stay low in athletic position, shuffle sideways pushing off outside foot, keep toes pointing forward, and maintain continuous movement side to side'
    },
    'Power Skips': {
      what: 'Explosive skipping movement emphasizing height and power in each skip',
      why: 'Develops explosive lower body power, improves vertical jump ability, and builds cardiovascular endurance with plyometric benefits',
      how: 'Skip forward driving knee up high, push off forcefully with opposite leg, swing arms for momentum, and land softly before next explosive skip'
    },
    'Broad Jumps': {
      what: 'Horizontal explosive jump for maximum forward distance',
      why: 'Develops lower body explosive power, strengthens fast-twitch muscle fibers, and improves athletic jumping performance',
      how: 'Start in partial squat, swing arms back then explosively forward, jump forward as far as possible, land softly in squat position, and reset for next rep'
    },

    // GeneralFitnesses - 6 missing
    'Light Jogging in Place': {
      what: 'Stationary running movement performed at comfortable moderate pace',
      why: 'Gentle cardiovascular warm-up, increases body temperature safely, and prepares muscles and joints for more intense activity',
      how: 'Jog in place with natural running motion, lift knees to comfortable height, swing arms naturally, and maintain steady breathing rhythm'
    },
    'Marching in Place': {
      what: 'Deliberate high-knee stepping movement performed in a stationary position',
      why: 'Low-impact cardio warm-up, improves hip flexor mobility, and safely elevates heart rate for beginners or recovery',
      how: 'Stand tall, lift knees alternately to hip height or higher, keep core engaged, swing opposite arm with each step, and maintain controlled rhythm'
    },
    'Side Leg Raises': {
      what: 'Lateral leg lift targeting hip abductor muscles',
      why: 'Strengthens outer hips and glutes, improves lateral stability, and helps prevent knee and hip injuries',
      how: 'Stand on one leg with slight bend, lift other leg out to side keeping foot flexed, avoid leaning torso, and control the movement down'
    },
    'Wall Push Ups': {
      what: 'Modified push-up performed against a wall at an inclined angle',
      why: 'Builds upper body strength for beginners, reduces joint stress, and helps progress toward floor push-ups safely',
      how: 'Face wall arms length away, place hands on wall shoulder-width, lean in bending elbows, keep body straight, and push back to start'
    },
    'Low Impact Jumping Jacks': {
      what: 'Modified jumping jack with stepping motion instead of jumping',
      why: 'Provides cardio benefits without impact stress, safe for joints, and suitable for beginners or those with mobility limitations',
      how: 'Step one foot out to side while raising arms, return to center, alternate sides, and maintain continuous smooth movement throughout'
    },
    'Light Mountain Climbers': {
      what: 'Controlled alternating knee drive movement from plank position at moderate tempo',
      why: 'Core-cardio combination exercise, builds stamina, strengthens abs and hip flexors, and burns calories efficiently',
      how: 'Start in plank position, bring one knee toward chest, quickly switch legs, maintain level hips, and keep core tight throughout movement'
    }
  };

  try {
    let updatedCount = 0;

    // Update FlexibilityMobilities
    const flexCollection = db.collection('flexibilitymobilities');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const result = await flexCollection.updateOne(
        { title: title },
        { $set: content }
      );
      if (result.matchedCount > 0) {
        console.log(`✅ Updated ${title}`);
        updatedCount++;
      }
    }

    // Update Endurances
    const enduranceCollection = db.collection('endurances');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const result = await enduranceCollection.updateOne(
        { title: title },
        { $set: content }
      );
      if (result.matchedCount > 0) {
        console.log(`✅ Updated ${title}`);
        updatedCount++;
      }
    }

    // Update GeneralFitnesses
    const generalCollection = db.collection('generalfitnesses');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const result = await generalCollection.updateOne(
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
