const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fitforge');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');
  console.log('Final collections - Endurance & General Fitness...\n');

  let totalUpdated = 0;

  try {
    // =========================================================================
    // ENDURANCE COLLECTION - Focus: Building cardiovascular stamina
    // =========================================================================
    console.log('=== ENDURANCE ===');
    const enduranceUpdates = [
      {
        title: 'Running in Place',
        what: 'Running in Place is a cardio exercise where you simulate running motion while staying in one spot, lifting knees and pumping arms.',
        why: 'Running in Place is essential for endurance because it elevates heart rate, improves cardiovascular capacity, and builds the aerobic stamina needed for sustained physical activity.',
        how: 'The continuous movement increases heart rate and oxygen demand, training your cardiovascular system to work more efficiently and building the endurance needed for longer workouts and daily activities.'
      },
      {
        title: 'Fast Feet Drill',
        what: 'Fast Feet Drill involves rapidly moving feet up and down in small, quick steps while staying light on your toes.',
        why: 'Fast Feet Drill is crucial for endurance because it builds foot speed, cardiovascular capacity, and the quick recovery ability essential for sustained high-intensity efforts.',
        how: 'The rapid foot movements elevate heart rate while training fast-twitch muscle fibers for endurance, improving cardiovascular efficiency and muscle stamina simultaneously.'
      },
      {
        title: 'High Knees',
        what: 'High Knees are a cardio exercise where you run in place while driving knees up to hip level with each step.',
        why: 'High Knees are important for endurance because they significantly elevate heart rate, strengthen hip flexors, and build the leg endurance needed for running and sustained cardio.',
        how: 'The high knee drive creates intense cardiovascular demand while building hip and leg stamina, training your body to maintain high-intensity effort for extended periods.'
      },
      {
        title: 'Butt Kickers',
        what: 'Butt Kickers are performed by jogging in place while kicking heels up toward glutes with each step.',
        why: 'Butt Kickers are valuable for endurance because they improve leg turnover speed, build hamstring endurance, and enhance cardiovascular stamina through continuous movement.',
        how: 'The rapid heel kicks maintain elevated heart rate while building hamstring endurance, improving your ability to sustain running pace and cardiovascular effort.'
      },
      {
        title: 'Jumping Jacks',
        what: 'Jumping Jacks are a full-body cardio exercise where you jump while simultaneously spreading legs and raising arms overhead.',
        why: 'Jumping Jacks are essential for endurance because they engage the entire body, rapidly elevate heart rate, and build the total-body cardiovascular stamina needed for sustained exercise.',
        how: 'The coordinated jumping motion creates continuous cardiovascular demand, training your heart and lungs to work more efficiently for improved endurance across all activities.'
      },
      {
        title: 'Stair Climbers',
        what: 'Stair Climbers simulate climbing stairs, alternately stepping up with each leg in a continuous climbing motion.',
        why: 'Stair Climbers are crucial for endurance because they build leg strength and cardiovascular capacity simultaneously, improving the ability to sustain effort during uphill or elevated activities.',
        how: 'The stepping motion creates sustained cardiovascular demand while building leg muscle endurance, training your body to efficiently handle prolonged climbing and cardio efforts.'
      },
      {
        title: 'Boxer Shuffle',
        what: 'Boxer Shuffle is a footwork drill involving quick side-to-side and forward-back stepping while staying on the balls of feet.',
        why: 'Boxer Shuffle is important for endurance because it builds foot speed, cardiovascular stamina, and the agility endurance athletes need for sustained dynamic movement.',
        how: 'The constant shuffling motion maintains elevated heart rate while training footwork endurance, improving your ability to maintain quick movements throughout long workout sessions.'
      },
      {
        title: 'Lateral Shuffle',
        what: 'Lateral Shuffle involves quick side-to-side stepping movements while maintaining athletic stance and facing forward.',
        why: 'Lateral Shuffle is valuable for endurance because it builds lateral movement stamina and cardiovascular capacity needed for sports requiring sustained side-to-side motion.',
        how: 'The continuous lateral movement elevates heart rate while building leg endurance in lateral planes, improving your ability to sustain multi-directional athletic efforts.'
      },
      {
        title: 'Step Ups',
        what: 'Step Ups involve repeatedly stepping up onto an elevated platform with alternating legs in a continuous motion.',
        why: 'Step Ups are essential for endurance because they build leg strength and cardiovascular stamina simultaneously, improving your ability to sustain climbing or stepping activities.',
        how: 'The repetitive stepping motion creates sustained cardiovascular demand while building leg muscle endurance, training your body for prolonged stair climbing and hiking efforts.'
      },
      {
        title: 'Squat Jumps',
        what: 'Squat Jumps combine a squat with an explosive vertical jump, landing softly and immediately repeating the movement.',
        why: 'Squat Jumps are crucial for endurance because they build explosive power endurance and cardiovascular capacity through high-intensity repeated efforts.',
        how: 'The explosive jumping motion creates intense cardiovascular demand while training muscles to repeatedly generate power, building the stamina needed for sustained high-intensity efforts.'
      },
      {
        title: 'Burpees',
        what: 'Burpees are a full-body exercise combining a squat, plank, push-up, and jump into one continuous movement.',
        why: 'Burpees are essential for endurance because they rapidly elevate heart rate while engaging every major muscle group, building total-body cardiovascular and muscular endurance.',
        how: 'The multi-movement sequence creates maximum cardiovascular demand while training full-body stamina, dramatically improving your ability to sustain high-intensity total-body efforts.'
      },
      {
        title: 'Skaters',
        what: 'Skaters are a lateral jumping exercise mimicking speed skating motion, jumping side-to-side on single leg.',
        why: 'Skaters are important for endurance because they build single-leg stability endurance and cardiovascular capacity through sustained lateral jumping efforts.',
        how: 'The continuous lateral jumping maintains elevated heart rate while building leg endurance, improving your ability to sustain dynamic, unilateral movements over time.'
      },
      {
        title: 'Rope Jumping Simulation',
        what: 'Rope Jumping Simulation mimics jump rope motion without an actual rope, performing small continuous jumps with wrist rotation.',
        why: 'Jump rope simulation is valuable for endurance because it builds calf endurance, cardiovascular stamina, and the rhythmic coordination needed for sustained cardio activities.',
        how: 'The continuous jumping motion creates sustained cardiovascular demand while building calf and foot stamina, efficiently improving overall cardiovascular endurance.'
      },
      {
        title: 'Power Skips',
        what: 'Power Skips are an explosive skipping motion where you drive one knee high while hopping forcefully off the opposite leg.',
        why: 'Power Skips are crucial for endurance because they build explosive power endurance and cardiovascular capacity through repeated high-intensity efforts.',
        how: 'The explosive skipping motion trains your body to repeatedly generate power while maintaining elevated heart rate, building the stamina needed for sustained explosive movements.'
      },
      {
        title: 'Tuck Jumps',
        what: 'Tuck Jumps involve jumping vertically while pulling knees up toward chest, then landing softly and immediately repeating.',
        why: 'Tuck Jumps are essential for endurance because they create maximum cardiovascular demand through explosive full-body efforts, building high-intensity endurance capacity.',
        how: 'The explosive tucking motion rapidly elevates heart rate while training muscles to repeatedly generate maximum power, dramatically improving your ability to sustain intense efforts.'
      }
    ];

    const enduranceCol = db.collection('endurances');
    for (const update of enduranceUpdates) {
      const result = await enduranceCol.updateOne(
        { title: update.title },
        { $set: { what: update.what, why: update.why, how: update.how } }
      );
      if (result.matchedCount > 0) {
        console.log(`✅ ${update.title}`);
        totalUpdated++;
      }
    }
    console.log(`Updated ${enduranceUpdates.length} Endurance exercises\n`);

    // =========================================================================
    // GENERAL FITNESS - Focus: Overall health and functional fitness
    // =========================================================================
    console.log('=== GENERAL FITNESS ===');
    const generalFitnessUpdates = [
      {
        title: 'Jumping Jacks',
        what: 'Jumping Jacks are a classic full-body cardio warmup where you jump while spreading legs and raising arms overhead.',
        why: 'Jumping Jacks are essential for general fitness because they warm up the entire body, improve coordination, and elevate heart rate for overall cardiovascular health.',
        how: 'The rhythmic full-body movement increases blood flow, warms muscles, and improves cardiovascular function, building the foundational fitness needed for all physical activities.'
      },
      {
        title: 'Arm Circles',
        what: 'Arm Circles involve rotating extended arms in circular motions to warm up shoulder joints and muscles.',
        why: 'Arm Circles are important for general fitness because they mobilize shoulder joints, improve blood flow to upper body, and prepare shoulders for exercise preventing injury.',
        how: 'The circular motion lubricates shoulder joints, activates rotator cuff muscles, and increases upper body circulation for improved shoulder health and mobility.'
      },
      {
        title: 'Leg Swings',
        what: 'Leg Swings involve swinging one leg forward and back or side to side while balancing on the other leg.',
        why: 'Leg Swings are valuable for general fitness because they dynamically stretch leg muscles, improve hip mobility, and enhance balance crucial for daily functional movements.',
        how: 'The swinging motion increases hip range of motion, warms leg muscles, and challenges balance, improving overall lower body mobility and functional fitness.'
      },
      {
        title: 'Torso Twists',
        what: 'Torso Twists involve rotating your upper body side to side while keeping hips stable to mobilize the spine.',
        why: 'Torso Twists are essential for general fitness because they improve spinal rotation mobility, warm up core muscles, and enhance functional rotation needed for daily activities.',
        how: 'The twisting motion mobilizes spinal segments, activates core muscles, and improves rotational range, building better functional fitness for everyday movements.'
      },
      {
        title: 'Bodyweight Squats',
        what: 'Bodyweight Squats are a fundamental movement where you lower hips by bending knees while keeping chest up.',
        why: 'Bodyweight Squats are crucial for general fitness because they strengthen legs, improve mobility, and train the most important functional movement pattern for daily living.',
        how: 'Squatting builds leg strength, improves hip and ankle mobility, and trains the sitting-standing pattern essential for maintaining independence and functional fitness throughout life.'
      },
      {
        title: 'Walk in Place',
        what: 'Walk in Place involves marching with alternating leg lifts and arm swings, simulating walking motion while stationary.',
        why: 'Walking in Place is important for general fitness because it gently elevates heart rate, improves coordination, and provides low-impact cardiovascular activity suitable for all fitness levels.',
        how: 'The marching motion increases heart rate gradually, warms muscles, and improves coordination, building foundational cardiovascular fitness without joint stress.'
      },
      {
        title: 'Side Steps',
        what: 'Side Steps involve stepping laterally side to side in a controlled manner, often touching down with each step.',
        why: 'Side Steps are valuable for general fitness because they improve lateral movement ability, build hip stability, and enhance balance needed for safe daily movement.',
        how: 'The lateral stepping motion strengthens hip stabilizers, improves side-to-side coordination, and builds the lateral movement fitness that prevents falls and injuries.'
      },
      {
        title: 'Light Lunges',
        what: 'Light Lunges are a gentle version of lunges where you step forward and lower hips to stretch and strengthen legs.',
        why: 'Light Lunges are essential for general fitness because they build single-leg strength, improve balance, and train the stepping pattern fundamental to walking and stair climbing.',
        how: 'The lunge motion strengthens legs individually, improves hip flexibility, and enhances balance, building the functional strength needed for everyday activities.'
      },
      {
        title: 'Hip Circles',
        what: 'Hip Circles involve rotating hips in circular motions while standing to mobilize hip joints and activate surrounding muscles.',
        why: 'Hip Circles are crucial for general fitness because they improve hip mobility, activate glutes, and enhance range of motion essential for pain-free movement.',
        how: 'The circular motion lubricates hip joints, activates hip muscles, and improves mobility, building better hip health and functional movement quality.'
      },
      {
        title: 'Ankle Rolls',
        what: 'Ankle Rolls involve rotating ankles in circular motions to mobilize ankle joints and warm up lower leg muscles.',
        why: 'Ankle Rolls are important for general fitness because they improve ankle mobility, reduce injury risk, and enhance balance crucial for safe walking and running.',
        how: 'The rolling motion increases ankle range of motion, strengthens stabilizing muscles, and improves proprioception for better balance and ankle health.'
      },
      {
        title: 'Shoulder Rolls',
        what: 'Shoulder Rolls involve rolling shoulders forward and backward in circular motions to release tension and improve mobility.',
        why: 'Shoulder Rolls are valuable for general fitness because they relieve upper body tension, improve posture, and maintain shoulder mobility for daily reaching activities.',
        how: 'The rolling motion releases muscle tension, mobilizes shoulder joints, and improves circulation, building better shoulder health and posture for daily function.'
      },
      {
        title: 'Knee Raises',
        what: 'Knee Raises involve lifting knees toward chest in alternating fashion while standing, often with light arm swing.',
        why: 'Knee Raises are essential for general fitness because they gently elevate heart rate, strengthen hip flexors, and improve balance needed for walking and stair climbing.',
        how: 'The lifting motion warms hip flexors, improves cardiovascular function, and enhances balance, building foundational fitness for everyday movements.'
      },
      {
        title: 'Gentle Punches',
        what: 'Gentle Punches involve light boxing motions alternating arms forward, engaging core and upper body without strain.',
        why: 'Gentle Punches are important for general fitness because they warm up upper body, engage core muscles, and provide fun, low-impact cardio appropriate for all ages.',
        how: 'The punching motion activates shoulders and core, elevates heart rate gently, and improves coordination, building functional upper body fitness and cardiovascular health.'
      },
      {
        title: 'Side Bends',
        what: 'Side Bends involve bending torso laterally side to side to stretch obliques and improve lateral spine mobility.',
        why: 'Side Bends are crucial for general fitness because they maintain lateral flexibility, stretch side muscles, and improve the side-bending mobility needed for daily reaching.',
        how: 'The bending motion stretches obliques and intercostals, mobilizes spine laterally, and improves side flexibility for better functional movement range.'
      },
      {
        title: 'Light Mountain Climbers',
        what: 'Light Mountain Climbers are a gentle version performed in plank position, alternating bringing knees toward chest at moderate pace.',
        why: 'Light Mountain Climbers are valuable for general fitness because they engage the full body, build core strength, and provide scalable cardio suitable for various fitness levels.',
        how: 'The climbing motion warms the entire body, strengthens core muscles, and elevates heart rate progressively, building well-rounded fitness without excessive strain.'
      }
    ];

    const gfCol = db.collection('generalfitnesses');
    for (const update of generalFitnessUpdates) {
      const result = await gfCol.updateOne(
        { title: update.title },
        { $set: { what: update.what, why: update.why, how: update.how } }
      );
      if (result.matchedCount > 0) {
        console.log(`✅ ${update.title}`);
        totalUpdated++;
      }
    }
    console.log(`Updated ${generalFitnessUpdates.length} General Fitness exercises\n`);

    console.log(`\n${'='.repeat(50)}`);
    console.log(`TOTAL EXERCISES UPDATED: ${totalUpdated}`);
    console.log(`${'='.repeat(50)}\n`);

  } catch (error) {
    console.error('Error:', error);
  }

  await mongoose.connection.close();
  process.exit(0);
});
