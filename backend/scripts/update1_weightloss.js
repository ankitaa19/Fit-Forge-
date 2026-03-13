const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fitforge');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');
  console.log('Starting comprehensive update of all exercise descriptions...\n');

  try {
    // ============================================================================
    // WEIGHT LOSS COLLECTION - Focus: Calorie burning and fat loss
    // ============================================================================
    console.log('=== UPDATING WEIGHT LOSS EXERCISES ===');
    const weightLossUpdates = [
      {
        title: 'Jumping Jacks',
        what: 'Jumping Jacks are a full-body cardiovascular exercise where you jump while spreading your legs and raising your arms overhead.',
        why: 'This exercise is crucial for weight loss because it elevates your heart rate quickly, burns calories efficiently, and engages multiple muscle groups simultaneously to maximize calorie expenditure.',
        how: 'By performing high-repetition Jumping Jacks, you create an aerobic effect that boosts fat-burning metabolism and contributes to the calorie deficit essential for losing weight.'
      },
      {
        title: 'Burpees',
        what: 'Burpees are a high-intensity compound exercise combining a squat, plank, push-up, and explosive jump into one continuous movement.',
        why: 'Burpees are essential for weight loss because they burn massive calories in minimal time, spike your heart rate, and create an afterburn effect that continues burning fat hours after exercise.',
        how: 'The explosive full-body nature of burpees maximizes calorie burn while building lean muscle that increases your resting metabolic rate, accelerating weight loss results.'
      },
      {
        title: 'Mountain Climbers',
        what: 'Mountain Climbers are a dynamic cardio exercise performed in a plank position, alternating bringing knees toward your chest in a running motion.',
        why: 'This exercise is vital for weight loss because it combines intensive cardio with core strengthening, burning significant calories while toning your midsection for visible fat loss.',
        how: 'Mountain Climbers accelerate weight loss by maintaining elevated heart rate, engaging core muscles continuously, and creating high metabolic demands that burn fat during and after workouts.'
      },
      {
        title: 'High Knees',
        what: 'High Knees is a running-in-place cardio exercise where you lift your knees to hip level at a rapid pace while pumping your arms.',
        why: 'High Knees are important for weight loss because they rapidly spike calorie burn, improve cardiovascular fitness, and engage leg muscles intensely for maximum fat-burning effect.',
        how: 'This exercise helps  achieve weight loss by combining intense lower body work with sustained cardio effort, creating high calorie expenditure that directly contributes to fat reduction.'
      },
      {
        title: 'Squat Jumps',
        what: 'Squat Jumps are a plyometric exercise combining a bodyweight squat with an explosive vertical jump.',
        why: 'Squat Jumps are crucial for weight loss because they combine strength training with explosive cardio, burning massive calories while building lean leg muscle that increases metabolism.',
        how: 'The high-intensity explosive nature creates substantial calorie burn during exercise and builds metabolism-boosting muscle that continues burning calories at rest, accelerating fat loss.'
      },
      {
        title: 'Step Touch Cardio',
        what: 'Step Touch Cardio is a simple side-to-side stepping movement that provides continuous moderate-intensity cardiovascular activity.',
        why: 'This exercise is important for weight loss because it offers sustainable low-impact cardio perfect for longer fat-burning sessions that accumulate significant calorie expenditure.',
        how: 'Step Touch helps achieve weight loss by maintaining your heart rate in the optimal fat-burning zone for extended periods, allowing consistent calorie burn without excessive fatigue.'
      },
      {
        title: 'Plank Jacks',
        what: 'Plank Jacks are a core-focused cardio exercise performed in a plank position while jumping your feet in and out.',
        why: 'Plank Jacks are essential for weight loss because they combine core strengthening with cardiovascular work, burning calories while building a strong midsection for visible ab definition.',
        how: 'This exercise contributes to weight loss by engaging your entire core while maintaining elevated heart rate, creating dual benefits of calorie burn and muscle toning for a leaner physique.'
      },
      {
        title: 'Butt Kicks',
        what: 'Butt Kicks are a cardio exercise where you run in place while kicking your heels up toward your glutes.',
        why: 'Butt Kicks are important for weight loss because they provide intense cardio that burns calories rapidly while strengthening hamstrings and improving cardiovascular endurance.',
        how: 'By maintaining a fast pace with Butt Kicks, you elevate metabolism, burn significant calories, and build lean leg muscle that supports sustained weight loss.'
      },
      {
        title: 'Skaters',
        what: 'Skaters are a lateral jumping exercise that mimics the side-to-side explosive motion of speed skating.',
        why: 'Skaters are crucial for weight loss because they provide high-intensity lateral cardio that burns calories while engaging often-neglected side muscles for balanced fat loss.',
        how: 'The explosive lateral movement creates high calorie expenditure, builds leg strength, and improves agility while contributing to overall fat reduction and improved body composition.'
      },
      {
        title: 'Jumping Lunges',
        what: 'Jumping Lunges are a plyometric exercise alternating between lunge positions with an explosive jump between each repetition.',
        why: 'Jumping Lunges are essential for weight loss because they combine lower body strength work with explosive cardio, creating maximum calorie burn while sculpting lean legs.',
        how: 'This exercise accelerates weight loss by demanding significant energy from legs and cardiovascular system, burning calories intensely while building metabolism-boosting muscle mass.'
      },
      {
        title: 'Speed Skaters',
        what: 'Speed Skaters are a dynamic lateral movement exercise involving explosive side-to-side jumps while maintaining a slight crouch.',
        why: 'Speed Skaters are vital for weight loss because they provide interval-style cardio that maximizes calorie burn while improving lateral strength and cardiovascular fitness.',
        how: 'The high-intensity nature creates substantial metabolic demands, burning calories rapidly and building lean muscle that supports sustained fat-loss efforts.'
      },
      {
        title: 'Tuck Jumps',
        what: 'Tuck Jumps are an explosive plyometric exercise where you jump vertically while bringing your knees toward your chest at the peak.',
        why: 'Tuck Jumps are crucial for weight loss because they provide maximum-intensity cardio that burns calories at an extremely high rate while building explosive power.',
        how: 'This exercise contributes to weight loss through intense calorie expenditure, elevated heart rate, and the afterburn effect that continues burning fat long after completion.'
      },
      {
        title: 'Invisible Jump Rope',
        what: 'Invisible Jump Rope mimics the movement of jumping rope without equipment, maintaining the same footwork and arm motions.',
        why: 'This exercise is important for weight loss because it provides sustained cardiovascular activity that burns calories consistently while being accessible anywhere.',
        how: 'Invisible Jump Rope helps achieve weight loss by maintaining heart rate in an optimal fat-burning zone, allowing for extended cardio sessions that maximize calorie expenditure.'
      },
      {
        title: 'Power Jacks',
        what: 'Power Jacks are an amplified version of jumping jacks performed with greater intensity, power, and range of motion.',
        why: 'Power Jacks are essential for weight loss because they dramatically elevate heart rate and calorie burn through explosive full-body movements that engage all major muscle groups.',
        how: 'The powerful maximal-effort nature creates superior calorie burn compared to standard cardio, accelerating fat loss while building cardiovascular endurance.'
      },
      {
        title: 'Punches',
        what: 'Punches are boxing-inspired movements involving rapid alternating forward strikes with proper arm extension and hip rotation.',
        why: 'Punches are valuable for weight loss because they provide high-intensity upper body cardio that burns calories while toning arms, shoulders, and core.',
        how: 'Rapid punching movements elevate heart rate significantly, burn calories through continuous motion, and build lean upper body muscle that supports metabolism and fat loss.'
      }
    ];

    const weightLossCol = db.collection('weightloss');
    let wlCount = 0;
    for (const update of weightLossUpdates) {
      const result = await weightLossCol.updateOne(
        { title: update.title },
        { $set: { what: update.what, why: update.why, how: update.how } }
      );
      if (result.modifiedCount > 0 || result.matchedCount > 0) {
        console.log(`✅ ${update.title}`);
        wlCount++;
      } else {
        console.log(`⚠️  Not found: ${update.title}`);
      }
    }
    console.log(`Updated ${wlCount}/${weightLossUpdates.length} Weight Loss exercises\n`);

    // Continue in next part...
    console.log('\n✅ Weight Loss collection updated successfully');
    console.log('\nRun the next script to continue with other collections...');

  } catch (error) {
    console.error('Error:', error);
  }

  await mongoose.connection.close();
  process.exit(0);
});
