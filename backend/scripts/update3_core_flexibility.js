const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fitforge');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB\n');
  console.log('Continuing with remaining collections...\n');

  let totalUpdated = 0;

  try {
    // =========================================================================
    // CORE STRENGTH COLLECTION - Focus: Building core stability and strength
    // =========================================================================
    console.log('=== CORE STRENGTH ===');
    const coreStrengthUpdates = [
      {
        title: 'Plank',
        what: 'Plank is an isometric core exercise where you hold your body in a straight line supported by forearms and toes.',
        why: 'Planks are essential for core strength because they engage the entire core musculature simultaneously, building rock-solid stability that supports all movements and prevents injury.',
        how: 'By holding the plank position, you create constant tension in abs, obliques, and deep core muscles, developing the endurance and strength needed for a powerful, functional core.'
      },
      {
        title: 'Leg Raises',
        what: 'Leg Raises are a lower abdominal exercise where you lie on your back and lift your legs straight up while keeping them together.',
        why: 'Leg Raises are crucial for core strength because they target the often-neglected lower abs and hip flexors, building complete core development from top to bottom.',
        how: 'The controlled leg lifting motion creates intense tension in lower abdominals and deep core muscles, strengthening the foundation of your core for better stability and definition.'
      },
      {
        title: 'Russian Twists',
        what: 'Russian Twists are a rotational core exercise performed while seated, twisting your torso from side to side.',
        why: 'Russian Twists are important for core strength because they build rotational power in obliques, essential for functional movement and creating defined sides.',
        how: 'The twisting motion engages obliques and deep core stabilizers through rotation, developing the multi-directional strength needed for real-world core stability and athletic performance.'
      },
      {
        title: 'Bicycle Crunch',
        what: 'Bicycle Crunch is a dynamic abdominal exercise combining twisting motions and alternating knee-to-elbow movements in a cycling pattern.',
        why: 'Bicycle Crunches are essential for core strength because they simultaneously work upper abs, lower abs, and obliques, providing comprehensive core development in one exercise.',
        how: 'The coordinated twisting and crunching motion creates constant tension across the entire abdominal wall, building balanced core strength and visible definition.'
      },
      {
        title: 'Mountain Climbers',
        what: 'Mountain Climbers are a dynamic core exercise performed in plank position, alternately driving knees toward chest in a running motion.',
        why: 'Mountain Climbers are valuable for core strength because they combine isometric core stabilization with dynamic movement, building functional core strength under motion.',
        how: 'The rapid knee drives force your core to stabilize against momentum and rotation, developing the dynamic core control needed for athletic movement and injury prevention.'
      },
      {
        title: 'Flutter Kicks',
        what: 'Flutter Kicks are a lower ab exercise where you lie on your back and perform small, rapid alternating leg kicks.',
        why: 'Flutter Kicks are important for core strength because they create sustained tension in lower abs and hip flexors, building muscular endurance in these stabilizing muscles.',
        how: 'The continuous kicking motion maintains constant activation of lower core muscles, developing the endurance and strength needed for long-lasting core stability.'
      },
      {
        title: 'Side Plank',
        what: 'Side Plank is an isometric exercise supporting your body weight on one forearm and the side of one foot.',
        why: 'Side Planks are crucial for core strength because they specifically target obliques and lateral core muscles, essential for preventing side-bending injuries and creating V-shape torso.',
        how: 'The lateral isometric hold creates intense activation of obliques and deep stabilizers, building the lateral core strength necessary for balanced, injury-resistant core development.'
      },
      {
        title: 'Toe Touches',
        what: 'Toe Touches are an upper abdominal exercise where you lie flat and reach hands toward toes while lifting shoulder blades.',
        why: 'Toe Touches are valuable for core strength because they isolate upper abs through full range of motion, building strength and definition in the upper abdominal region.',
        how: 'The reaching motion creates peak contraction in upper abs while improving hamstring flexibility, developing both core strength and mobility simultaneously.'
      },
      {
        title: 'Dead Bug Exercise',
        what: 'Dead Bug is a core stabilization exercise performed on your back, extending opposite arm and leg while maintaining neutral spine.',
        why: 'Dead Bug is essential for core strength because it teaches proper core bracing and anti-extension strength, fundamental skills for preventing back pain and building functional core stability.',
        how: 'The controlled limb movements challenge your core to prevent spinal movement, developing the deep stabilization strength that protects your spine during all activities.'
      },
      {
        title: 'Reverse Crunch',
        what: 'Reverse Crunch is a lower abdominal exercise where you curl your hips off the ground by contracting your lower abs.',
        why: 'Reverse Crunches are crucial for core strength because they specifically target hard-to-reach lower abs, building  the lower core strength needed for complete midsection development.',
        how: 'The hip curling motion isolates lower abdominals through their primary function, creating the tension needed to develop strong, defined lower abs.'
      },
      {
        title: 'V-Ups',
        what: 'V-Ups are an advanced core exercise where you simultaneously lift your legs and upper body to form a V shape.',
        why: 'V-Ups are important for core strength because they work the entire abdominal wall through full range, building comprehensive core strength and impressive definition.',
        how: 'The simultaneous lifting motion creates maximum tension throughout the entire core, developing the strength and coordination needed for advanced core stability and athletic performance.'
      },
      {
        title: 'Hollow Body Hold',
        what: 'Hollow Body Hold  is an isometric exercise holding your body in a curved position with lower back pressed to ground.',
        why: 'Hollow Body Hold is essential for core strength because it teaches total body tension and anti-extension strength, foundations of gymnastic core control and injury prevention.',
        how: 'The sustained hollow position creates constant tension in deep core muscles, developing the full-body integration and core control  needed for advanced strength movements.'
      },
      {
        title: 'Heel Taps',
        what: 'Heel Taps are an oblique exercise where you crunch sideways, alternately tapping each hand to the same-side heel.',
        why: 'Heel Taps are valuable for core strength because they emphasize obliques through lateral flexion, building defined side muscles and functional lateral core strength.',
        how: 'The side-to-side tapping motion creates constant oblique activation, developing the side core strength needed for creating the V-taper appearance and preventing side-bending injuries.'
      },
      {
        title: 'Bird Dog',
        what: 'Bird Dog is a core stability exercise performed on all fours, extending opposite arm and leg while maintaining spine position.',
        why: 'Bird Dog is crucial for core strength because it builds anti-rotation strength and coordination, essential for functional core stability during asymmetric movements.',
        how: 'The opposite limb extension challenges your core to prevent rotation and extension, developing the stabilization strength that protects your spine during real-world activities.'
      },
      {
        title: 'Plank Shoulder Taps',
        what: 'Plank Shoulder Taps are a dynamic plank variation where you alternately lift hands to tap opposite shoulders.',
        why: 'Plank Shoulder Taps are important for core strength because they add anti-rotation challenge to basic plank, building dynamic core stability under movement.',
        how: 'The shoulder tapping motion forces your core to resist rotation while maintaining plank position, developing the dynamic stability needed for functional core strength in movement.'
      }
    ];

    const csCol = db.collection('corestrength');
    for (const update of coreStrengthUpdates) {
      const result = await csCol.updateOne(
        { title: update.title },
        { $set: { what: update.what, why: update.why, how: update.how } }
      );
      if (result.matchedCount > 0) {
        console.log(`✅ ${update.title}`);
        totalUpdated++;
      }
    }
    console.log(`Updated ${coreStrengthUpdates.length} Core Strength exercises\n`);

    // =========================================================================
    // FLEXIBILITY & MOBILITY - Focus: Improving flexibility and range of motion
    // =========================================================================
    console.log('=== FLEXIBILITY & MOBILITY ===');
    const flexibilityUpdates = [
      {
        title: 'Hamstring Stretch',
        what: 'Hamstring Stretch is a flexibility exercise where you reach toward your toes while keeping legs extended to lengthen hamstrings.',
        why: 'This stretch is essential for flexibility because tight hamstrings limit squat depth, cause lower back pain, and restrict overall leg mobility needed for optimal movement patterns.',
        how: 'Regular hamstring stretching gradually lengthens muscle fibers, improves flexibility in the posterior chain, and increases range of motion for better performance and injury prevention.'
      },
      {
        title: 'Cobra Pose',
        what: 'Cobra Pose is a backbending yoga stretch where you lie face down and press your upper body up while keeping hips on ground.',
        why: 'Cobra Pose is crucial for flexibility because it counteracts forward-hunched posture, opens the chest, and improves spinal extension mobility for better  posture and reduced back pain.',
        how: 'This backbend stretches abdominals and hip flexors while strengthening back muscles, improving spinal flexibility and range of motion for healthier, pain-free movement.'
      },
      {
        title: 'Downward Dog',
        what: 'Downward Dog is a full-body yoga pose forming an inverted V-shape, stretching hamstrings, calves, and shoulders simultaneously.',
        why: 'Downward Dog is important for flexibility because it addresses multiple tight areas at once, improving posterior chain flexibility essential for injury-free movement.',
        how: 'This position lengthens hamstrings, calves, and shoulder muscles while building upper body strength, creating balanced flexibility and mobility throughout the body.'
      },
      {
        title: 'Hip Flexor Stretch',
        what: 'Hip Flexor Stretch is performed in a lunge position, pushing hips forward to stretch the front of the hip.',
        why: 'This stretch is essential for flexibility because tight hip flexors from sitting cause lower back pain, poor posture, and limited hip extension needed for walking and running.',
        how: 'Regular hip flexor stretching lengthens these commonly tight muscles, improves hip mobility, and restores proper posture for pain-free movement and better athletic performance.'
      },
      {
        title: 'Child Pose',
        what: 'Child Pose is a resting yoga position where you sit back on your heels with arms extended forward and forehead touching ground.',
        why: 'Child Pose is valuable for flexibility because it gently stretches the spine, hips, and shoulders while promoting relaxation and stress relief.',
        how: 'This restorative pose lengthens the back, opens hips, and stretches shoulders, improving overall flexibility while providing mental and physical recovery.'
      },
      {
        title: 'Cat Cow Stretch',
        what: 'Cat Cow is a flowing spinal mobility exercise alternating between arching and rounding your back on all fours.',
        why: 'Cat Cow is crucial for flexibility because it mobilizes the entire spine through flexion and extension, improving spinal health and reducing stiffness from prolonged sitting.',
        how: 'The flowing movement lubricates spinal joints, stretches back muscles, and improves segmental spine flexibility for better posture and pain-free movement.'
      },
      {
        title: 'Seated Forward Fold',
        what: 'Seated Forward Fold is a hamstring and back stretch performed sitting with legs extended, folding torso forward over legs.',
        why: 'This stretch is important for flexibility because it deeply stretches the entire posterior chain, improving hamstring and back flexibility crucial for injury prevention.',
        how: 'The sustained forward fold gradually lengthens tight posterior muscles, increases spinal and hamstring flexibility, and promotes relaxation for improved range of motion.'
      },
      {
        title: 'Standing Quad Stretch',
        what: 'Standing Quad Stretch involves pulling one foot toward your glutes while standing, stretching the front thigh muscles.',
        why: 'This stretch is essential for flexibility because tight quads limit knee mobility, cause knee pain, and restrict athletic performance requiring full knee range.',
        how: 'Regular quad stretching lengthens these often-tight muscles, improves knee flexibility, and balances leg muscle development for better movement quality.'
      },
      {
        title: 'Butterfly Stretch',
        what: 'Butterfly Stretch  is performed sitting with soles of feet together, gently pressing knees toward ground to open hips.',
        why: 'Butterfly Stretch is crucial for flexibility because it opens tight hips from sitting, improves hip mobility essential for squatting, and reduces lower back stress.',
        how: 'This hip-opening stretch lengthens inner thigh muscles, improves hip rotation mobility, and enhances overall lower body flexibility for better movement patterns.'
      },
      {
        title: 'Shoulder Stretch',
        what: 'Shoulder Stretch involves pulling one arm across your body to stretch the shoulder and upper back muscles.',
        why: 'This stretch is important for flexibility because tight shoulders from desk work limit overhead mobility, cause neck pain, and restrict upper body movement.',
        how: 'Regular shoulder stretching lengthens tight shoulder muscles, improves shoulder mobility and posture, and reduces pain from prolonged computer use.'
      },
      {
        title: 'Neck Stretch',
        what: 'Neck Stretch involves gently tilting or rotating the head to stretch neck muscles and relieve tension.',
        why: 'Neck stretches are essential for flexibility because neck stiffness causes headaches, shoulder pain, and limited head mobility affecting daily activities.',
        how: 'Gentle neck stretching relieves muscle tension, improves neck range of motion, and reduces pain from poor posture or screen time.'
      },
      {
        title: 'Spinal Twist Stretch',
        what: 'Spinal Twist is a rotational stretch performed lying or sitting, rotating spine to stretch back and hip muscles.',
        why: 'Spinal twists are crucial for flexibility because they improve rotational mobility essential for golf, tennis, and daily twisting movements while relieving back tension.',
        how: 'The twisting motion mobilizes spinal segments, stretches back and hip muscles, and improves rotational flexibility for better athletic performance and pain relief.'
      },
      {
        title: 'Knee to Chest Stretch',
        what: 'Knee to Chest Stretch involves lying on your back and pulling one or both knees toward your chest to stretch lower back.',
        why: 'This stretch is important for flexibility because it relieves lower back tightness, stretches glutes, and provides immediate relief from back pain.',
        how: 'Pulling knees to chest gently stretches lower back and glute muscles, improves hip flexibility, and reduces spinal compression for pain relief.'
      },
      {
        title: 'Side Stretch',
        what: 'Side Stretch involves reaching one arm overhead while bending sideways to stretch the sides of your torso.',
        why: 'Side stretches are valuable for flexibility because they lengthen often-neglected side muscles, improve lateral spine mobility, and enhance breathing capacity.',
        how: 'The lateral bending motion stretches intercostals and obliques, improves side-bending flexibility, and creates better torso mobility for daily movements.'
      },
      {
        title: 'Lunge Stretch',
        what: 'Lunge Stretch is performed in a lunge position with focus on pushing hips forward to stretch hip flexors and quads.',
        why: 'Lunge stretches are essential for flexibility because they address multiple tight muscle groups simultaneously, improving hip mobility crucial for walking, running, and squatting.',
        how: 'The lunge position stretches hip flexors, quads, and calves together, efficiently improving lower body flexibility and range of motion for better movement quality.'
      }
    ];

    const fmCol = db.collection('flexibilitymobilities');
    for (const update of flexibilityUpdates) {
      const result = await fmCol.updateOne(
        { title: update.title },
        { $set: { what: update.what, why: update.why, how: update.how } }
      );
      if (result.matchedCount > 0) {
        console.log(`✅ ${update.title}`);
        totalUpdated++;
      }
    }
    console.log(`Updated ${flexibilityUpdates.length} Flexibility exercises\n`);

    console.log(`\n${'='.repeat(50)}`);
    console.log(`TOTAL EXERCISES UPDATED: ${totalUpdated}`);
    console.log(`${'='.repeat(50)}\n`);

  } catch (error) {
    console.error('Error:', error);
  }

  await mongoose.connection.close();
  process.exit(0);
});
