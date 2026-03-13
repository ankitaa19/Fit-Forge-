const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fitforge');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');
  console.log('Updating remaining exercises with correct titles...\n');

  let totalUpdated = 0;

  try {
    // =========================================================================
    // ENDURANCE - Missing exercises
    // =========================================================================
    console.log('=== ENDURANCE (Remaining) ===');
    const enduranceUpdates = [
      {
        title: 'Jump Rope',
        what: 'Jump Rope is a continuous cardio exercise where you jump over a rope swinging under your feet in rhythmic motion.',
        why: 'Jump Rope is essential for endurance because it rapidly elevates heart rate while building calf stamina and coordination, improving cardiovascular capacity efficiently.',
        how: 'The continuous jumping motion creates sustained cardiovascular demand while building leg and calf endurance, training your body to maintain high-intensity efforts for extended periods.'
      },
      {
        title: 'Cycling Simulation',
        what: 'Cycling Simulation mimics pedaling motion either standing or lying down, simulating bike riding without actual equipment.',
        why: 'Cycling Simulation is crucial for endurance because it builds leg strength and cardiovascular stamina with low impact, perfect for sustained aerobic training.',
        how: 'The pedaling motion creates continuous cardiovascular demand while building quad and hamstring endurance, improving your ability to sustain long-duration cardio efforts.'
      },
      {
        title: 'Sprint Intervals',
        what: 'Sprint Intervals involve alternating between maximum effort sprinting and recovery periods, training at high intensity.',
        why: 'Sprint Intervals are important for endurance because they dramatically improve cardiovascular capacity and VO2 max through high-intensity interval training.',
        how: 'The intense effort periods push cardiovascular limits while recovery allows sustained training volume, building superior endurance and metabolic conditioning.'
      },
      {
        title: 'Skater Jumps',
        what: 'Skater Jumps are lateral jumping movements mimicking speed skating, jumping side-to-side on one leg with reaching motion.',
        why: 'Skater Jumps are valuable for endurance because they build single-leg stability endurance and cardiovascular capacity through sustained lateral explosive efforts.',
        how: 'The continuous lateral jumping maintains elevated heart rate while building leg endurance and balance, improving your ability to sustain dynamic unilateral movements.'
      },
      {
        title: 'Jumping Lunges',
        what: 'Jumping Lunges are explosive alternating lunges where you jump and switch legs mid-air, landing in opposite lunge position.',
        why: 'Jumping Lunges are essential for endurance because they build leg strength and power endurance through repeated explosive efforts with cardiovascular demand.',
        how: 'The explosive jumping motion creates intense cardiovascular stress while building leg stamina, training your body to repeatedly generate power over time.'
      },
      {
        title: 'Speed Squats',
        what: 'Speed Squats are rapid bodyweight squats performed continuously at high pace to maintain elevated heart rate.',
        why: 'Speed Squats are crucial for endurance because they build leg strength endurance and cardiovascular capacity through sustained high-rep leg work.',
        how: 'The rapid squatting motion maintains elevated heart rate while building leg muscle endurance, improving your ability to sustain lower body efforts.'
      },
      {
        title: 'Box Step Runs',
        what: 'Box Step Runs involve rapidly alternating feet on an elevated platform or simulating the motion for continuous cardio.',
        why: 'Box Step Runs are important for endurance because they combine leg strength with cardiovascular training, building stamina for sustained climbing efforts.',
        how: 'The rapid stepping motion creates continuous cardiovascular demand while building leg endurance, training your body for sustained uphill or stair climbing activities.'
      },
      {
        title: 'Broad Jumps',
        what: 'Broad Jumps are horizontal jumps for maximum distance, explosively extending hips and swinging arms for power.',
        why: 'Broad Jumps are valuable for endurance because they build explosive power endurance through repeated maximum-effort horizontal jumps.',
        how: 'The explosive jumping motion trains your body to repeatedly generate horizontal power while elevating heart rate, building endurance for explosive movements.'
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
      } else {
        console.log(`❌ ${update.title} - NOT FOUND`);
      }
    }
    console.log(`Updated ${enduranceUpdates.length} Endurance exercises\n`);

    // =========================================================================
    // GENERAL FITNESS - Missing exercises
    // =========================================================================
    console.log('=== GENERAL FITNESS (Remaining) ===');
    const generalFitnessUpdates = [
      {
        title: 'Light Jogging in Place',
        what: 'Light Jogging in Place is a gentle cardio warmup where you jog with small steps while staying stationary.',
        why: 'Light Jogging is essential for general fitness because it gently elevates heart rate, warms muscles, and provides accessible low-impact cardio for all fitness levels.',
        how: 'The easy jogging motion gradually increases circulation and body temperature, building foundational cardiovascular fitness without joint stress.'
      },
      {
        title: 'Step Ups',
        what: 'Step Ups involve stepping up onto an elevated platform with alternating legs in a controlled, rhythmic motion.',
        why: 'Step Ups are important for general fitness because they build leg strength, improve balance, and train the stepping pattern essential for stairs and daily movement.',
        how: 'The stepping motion strengthens legs, improves coordination, and builds functional fitness for everyday activities like stair climbing and getting up from chairs.'
      },
      {
        title: 'Marching in Place',
        what: 'Marching in Place involves lifting knees alternately while swinging arms, simulating marching motion while stationary.',
        why: 'Marching is valuable for general fitness because it gently activates legs and core, warms the body, and provides safe, low-impact movement for all ages.',
        how: 'The marching motion increases circulation, warms muscles, and improves coordination, building foundational movement quality and cardiovascular health.'
      },
      {
        title: 'Standing Knee Raises',
        what: 'Standing Knee Raises involve lifting one knee at a time toward chest while maintaining balance on the opposite leg.',
        why: 'Standing Knee Raises are essential for general fitness because they strengthen hip flexors, improve balance, and train single-leg stability crucial for walking.',
        how: 'The knee raising motion builds hip strength and challenges balance, improving functional fitness and stability needed for safe daily movement.'
      },
      {
        title: 'Side Leg Raises',
        what: 'Side Leg Raises involve lifting one leg laterally away from body while standing, working hip abductor muscles.',
        why: 'Side Leg Raises are crucial for general fitness because they strengthen hip stabilizers, improve lateral balance, and prevent falls through better hip control.',
        how: 'The lateral leg motion strengthens outer hip muscles, improves side-to-side stability, and builds functional strength for safe walking and stair climbing.'
      },
      {
        title: 'Wall Push Ups',
        what: 'Wall Push Ups are a beginner-friendly push up variation performed against a wall while standing at an angle.',
        why: 'Wall Push Ups are important for general fitness because they build upper body strength safely and accessibly, perfect for all fitness levels and ages.',
        how: 'The angled pushing motion strengthens chest, shoulders, and arms with minimal strain, building foundational upper body fitness progressively.'
      },
      {
        title: 'Heel Raises',
        what: 'Heel Raises (Calf Raises) involve rising up onto toes and lowering back down to strengthen calf muscles.',
        why: 'Heel Raises are valuable for general fitness because they strengthen calves and ankles, improve balance, and support better walking and stair climbing ability.',
        how: 'The raising motion strengthens calf muscles and ankle stability, improving lower leg strength essential for maintaining mobility and preventing falls.'
      },
      {
        title: 'Standing Side Bends',
        what: 'Standing Side Bends involve bending torso laterally to each side to stretch obliques and mobilize spine.',
        why: 'Standing Side Bends are essential for general fitness because they maintain lateral flexibility, stretch side muscles, and keep spine mobile for daily reaching movements.',
        how: 'The bending motion stretches obliques and intercostals, mobilizes spine laterally, and improves side flexibility for better functional movement range in daily activities.'
      },
      {
        title: 'Low Impact Jumping Jacks',
        what: 'Low Impact Jumping Jacks are a modified version where you step side to side instead of jumping, raising arms overhead.',
        why: 'Low Impact Jumping Jacks are crucial for general fitness because they provide joint-friendly cardio warmup suitable for beginners, seniors, or during injury recovery.',
        how: 'The stepping motion warms the body and elevates heart rate gently without joint impact, building accessible cardiovascular fitness for all populations.'
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
      } else {
        console.log(`❌ ${update.title} - NOT FOUND`);
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
