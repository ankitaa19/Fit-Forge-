const mongoose = require('mongoose');
const WeightLoss = require('../models/WeightLoss');
const MuscleGain = require('../models/MuscleGain');
const CoreStrength = require('../models/CoreStrength');
const FlexibilityMobility = require('../models/FlexibilityMobility');
const Endurance = require('../models/Endurance');
const GeneralFitness = require('../models/GeneralFitness');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fitforge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const motivationalContent = {
  // Weight Loss Exercises
  'Running in Place': {
    what: 'A stationary cardio exercise that simulates running without moving forward.',
    why: 'Burns calories quickly, improves cardiovascular health, and requires no equipment.',
    how: 'Stand with feet hip-width apart, pump your arms, and lift knees alternately as if running. Keep your core engaged and maintain a steady pace.'
  },
  'Butt Kicks': {
    what: 'A dynamic warm-up and cardio exercise targeting the hamstrings.',
    why: 'Increases heart rate, burns calories, and improves leg flexibility and coordination.',
    how: 'Jog in place while kicking your heels up to touch your glutes. Keep your torso upright and arms pumping at your sides.'
  },
  'Side Lunges': {
    what: 'A lateral leg exercise that works your inner and outer thighs.',
    why: 'Strengthens legs, improves hip mobility, and burns fat through compound movement.',
    how: 'Step wide to one side, bend that knee while keeping the other leg straight. Push back to center and repeat on the other side.'
  },
  'Jump Squats': {
    what: 'An explosive lower body exercise combining squats with jumping.',
    why: 'Maximizes calorie burn, builds leg power, and boosts metabolism for hours after exercise.',
    how: 'Perform a squat, then explode upward jumping as high as possible. Land softly and immediately go into the next squat.'
  },
  'Step Touch Cardio': {
    what: 'A simple side-to-side stepping movement for cardiovascular exercise.',
    why: 'Low-impact cardio that burns calories while being gentle on joints.',
    how: 'Step to the right, bring left foot to meet it with a tap. Step left, bring right foot with a tap. Add arm movements and keep a steady rhythm.'
  },
  'Plank Jacks': {
    what: 'A combination of planks and jumping jacks for full-body activation.',
    why: 'Burns calories while strengthening core, shoulders, and improving cardiovascular fitness.',
    how: 'Start in plank position. Jump feet wide apart, then back together while maintaining a strong plank. Keep hips level and core tight.'
  },
  'Star Jumps': {
    what: 'An explosive full-body exercise where you jump into a star shape.',
    why: 'Maximizes calorie burn, improves coordination, and works every major muscle group.',
    how: 'Start in a squat. Explode upward, extending arms and legs out into a star shape. Land softly and return to squat position.'
  },
  'Fast Feet Drill': {
    what: 'A high-intensity agility exercise involving rapid foot movement.',
    why: 'Burns maximum calories in minimal time while improving speed and agility.',
    how: 'Stand with feet wide, knees bent. Move feet up and down as fast as possible while staying low. Keep core engaged and maintain quick tempo.'
  },
  'Mountain Climbers': {
    what: 'A dynamic full-body exercise simulating climbing motion in plank position.',
    why: 'Burns calories rapidly while strengthening core, shoulders, and building cardiovascular endurance.',
    how: 'Start in plank position. Drive one knee toward chest, then quickly switch legs in a running motion. Keep hips level and maintain steady pace.'
  },
  'High Knees': {
    what: 'A running-in-place exercise with knees lifted high.',
    why: 'Excellent for burning calories quickly and improving cardiovascular fitness and leg strength.',
    how: 'Run in place while lifting knees to hip height or higher. Pump arms vigorously and maintain fast pace for maximum calorie burn.'
  },
  'Squat Jumps': {
    what: 'Plyometric exercise combining squats with explosive jumps.',
    why: 'Burns maximum calories, builds explosive leg power, and boosts post-workout metabolism.',
    how: 'Squat down, then jump explosively reaching arms overhead. Land softly toe-to-heel and immediately lower into next squat.'
  },
  'Jump Rope': {
    what: 'Classic cardio exercise using a rope or simulating rope jumping.',
    why: 'One of the most efficient calorie-burners, improves coordination and cardiovascular health.',
    how: 'Jump with both feet together, swinging rope (or mimicking) overhead. Land on balls of feet, keep jumps small and maintain steady rhythm.'
  },
  'Skater Jumps': {
    what: 'A lateral jumping exercise mimicking speed skating movements.',
    why: 'Burns calories while building leg strength, improving balance and lateral agility.',
    how: 'Leap sideways from one leg to the other, landing on outside leg. Swing arms across body. Keep low and push off powerfully.'
  },
  'Jumping Jacks': {
    what: 'A classic full-body exercise involving jumping and spreading limbs.',
    why: 'Simple yet effective for raising heart rate, burning calories, and warming up the entire body.',
    how: 'Jump feet wide while raising arms overhead. Jump feet back together while bringing arms to sides. Maintain steady, controlled pace.'
  },
  'Burpees': {
    what: 'A full-body exercise combining squat, plank, push-up, and jump.',
    why: 'The ultimate calorie burner that builds strength, endurance, and burns fat rapidly.',
    how: 'Squat down, place hands on floor. Jump feet back to plank. Do a push-up. Jump feet to hands, then jump up with arms overhead.'
  },

  // Muscle Gain Exercises
  'Bulgarian Split Squats': {
    what: 'A single-leg squat variation with rear foot elevated on a bench.',
    why: 'Builds powerful quads, glutes, and hamstrings while improving balance and eliminating leg strength imbalances.',
    how: 'Place one foot on bench behind you. Lower down until front thigh is parallel to ground. Drive through front heel to stand. Keep torso upright.'
  },
  'Pike Push-Ups': {
    what: 'An inverted push-up variation targeting shoulders.',
    why: 'Builds strong, muscular shoulders and prepares you for advanced movements like handstand push-ups.',
    how: 'Start in downward dog position with hips high. Bend elbows to lower head toward ground. Push back up while maintaining pike position.'
  },
  'Diamond Push-Ups': {
    what: 'A push-up variation with hands forming a diamond shape.',
    why: 'Maximizes tricep activation for arm muscle growth while also hitting chest and shoulders.',
    how: 'Place hands close together with thumbs and index fingers touching to form diamond. Lower chest to hands, keeping elbows close to body. Push up.'
  },
  'Single-Leg Glute Bridge': {
    what: 'A unilateral hip thrust exercise targeting glutes and hamstrings.',
    why: 'Builds strong, shapely glutes and powerful hamstrings while fixing muscle imbalances.',
    how: 'Lie on back, one foot flat on floor. Extend other leg straight. Drive through planted foot to lift hips high. Squeeze glutes at top.'
  },
  'Archer Push-Ups': {
    what: 'An advanced push-up variation shifting weight from side to side.',
    why: 'Builds massive chest and arm strength while preparing for one-arm push-ups.',
    how: 'Start in wide push-up position. Lower toward one side, sliding opposite arm straight. Push back to center. Alternate sides.'
  },
  'Jump Squats (Explosive)': {
    what: 'A plyometric squat variation for explosive power.',
    why: 'Builds powerful, explosive leg muscles and increases muscle fiber recruitment for maximum growth.',
    how: 'Squat down then explode upward with maximum force. Land softly and go directly into next rep. Focus on explosive power.'
  },
  'Decline Push-Ups': {
    what: 'Push-ups performed with feet elevated on a surface.',
    why: 'Increases resistance to build upper chest and shoulder muscles more effectively.',
    how: 'Place feet on bench or step, hands on floor. Lower chest down keeping body straight. Push up explosively. Keep core tight throughout.'
  },
  'Windshield Wipers': {
    what: 'An advanced rotational core exercise performed hanging or lying down.',
    why: 'Builds incredibly strong obliques and core stabilizers for a powerful, defined midsection.',
    how: 'Hang from bar or lie down. Lift legs to 90 degrees. Rotate legs side to side in controlled motion. Keep upper body stable.'
  },
  'Pistol Squats': {
    what: 'A single-leg squat performed all the way to the ground.',
    why: 'The ultimate leg builder that creates powerful, balanced legs and incredible functional strength.',
    how: 'Stand on one leg, extend other forward. Squat down on one leg until fully descended. Drive through heel to stand. Use assistance if needed.'
  },
  'Pseudo Planche Push-Ups': {
    what: 'An advanced push-up with hands positioned further back.',
    why: 'Builds extraordinary shoulder and chest strength while developing impressive upper body control.',
    how: 'Place hands by hips in push-up position. Lean forward, keeping body straight. Lower down close to ground. Push up with powerful press.'
  },
  'Nordic Curls': {
    what: 'An eccentric hamstring exercise kneeling and lowering forward.',
    why: 'Builds incredibly strong hamstrings and helps prevent injury while creating powerful legs.',
    how: 'Kneel with feet anchored. Slowly lower torso forward keeping body straight from knees up. Push back up using hamstrings. Use hands to assist.'
  },
  'Typewriter Push-Ups': {
    what: 'A side-to-side push-up variation at the bottom position.',
    why: 'Maximizes chest and arm development while building incredible strength and control.',
    how: 'Lower to bottom of push-up. Shift weight side to side, keeping chest close to ground. Push up. Repeat on other side.'
  },
  'Dragon Flags': {
    what: 'An advanced core exercise lifting entire body using only shoulders.',
    why: 'Builds an incredibly strong, defined core and develops impressive total body control.',
    how: 'Lie on bench, grip behind head. Lift entire body up keeping it straight. Lower slowly with control. Keep body rigid throughout movement.'
  },
  'Superman Push-Ups': {
    what: 'An explosive push-up where hands leave the ground.',
    why: 'Builds explosive upper body power and impressive chest, shoulder and arm muscles.',
    how: 'Perform push-up but explode up powerfully so hands leave ground. Clap hands or reach forward. Land safely and repeat.'
  },
  'L-Sit Hold': {
    what: 'An isometric hold with legs extended straight out while hanging.',
    why: 'Builds incredible core strength, powerful hip flexors, and develops exceptional body control.',
    how: 'Sit with hands on floor or parallel bars. Lift body up with straight arms. Extend legs straight forward forming an L. Hold position.'
  },

  // Core Strength Exercises
  'Plank': {
    what: 'An isometric core exercise holding a straight body position.',
    why: 'Builds rock-solid core strength, improves posture, and strengthens the entire midsection.',
    how: 'Start on forearms and toes with body in straight line from head to heels. Squeeze core and glutes. Hold position without sagging hips.'
  },
  'Leg Raises': {
    what: 'An abdominal exercise lifting legs while lying on back.',
    why: 'Targets hard-to-reach lower abs, builds hip flexor strength, and creates defined lower abdominals.',
    how: 'Lie on back, legs straight. Keep lower back pressed to floor. Slowly lift legs to 90 degrees. Lower with control without touching floor.'
  },
  'Russian Twists': {
    what: 'A rotational core exercise performed while seated.',
    why: 'Sculpts obliques, improves rotational power, and builds functional core strength for daily movements.',
    how: 'Sit with knees bent, lean back slightly. Hold hands together. Rotate torso side to side, touching floor beside hips. Keep core tight.'
  },
  'Side Plank': {
    what: 'A lateral plank variation supporting body on one forearm.',
    why: 'Strengthens obliques and lateral core, improves side-to-side stability and balance.',
    how: 'Lie on side propped on forearm. Stack feet and lift hips creating straight line from head to feet. Hold position without letting hips sag.'
  },
  'Bicycle Crunches': {
    what: 'A dynamic ab exercise combining rotation and knee-to-elbow movement.',
    why: 'Works entire core including rectus and obliques, burns calories while sculpting defined abs.',
    how: 'Lie on back, hands behind head. Bring opposite knee to elbow in cycling motion. Extend other leg straight. Alternate sides smoothly.'
  },
  'Dead Bug': {
    what: 'A core stability exercise extending opposite limbs while on back.',
    why: 'Builds deep core stability, improves coordination, and teaches proper core engagement for all movements.',
    how: 'Lie on back, arms up and knees at 90°. Slowly extend opposite arm and leg. Return to start. Keep lower back pressed to floor throughout.'
  },
  'Mountain Climbers (Core Focus)': {
    what: 'A dynamic plank variation bringing knees to chest alternately.',
    why: 'Combines core strengthening with cardio, builds stability and endurance in abs and shoulders.',
    how: 'Hold strong plank position. Drive knees toward chest alternately. Keep hips level and core tight. Maintain controlled, steady pace.'
  },
  'Hollow Body Hold': {
    what: 'An advanced isometric position with lower back pressed to floor.',
    why: 'Builds incredible core strength and body control, essential foundation for advanced gymnastics movements.',
    how: 'Lie on back. Lift shoulders and legs slightly off ground, arms overhead. Press lower back into floor. Hold position without arching back.'
  },
  'Bird Dog': {
    what: 'A stability exercise extending opposite arm and leg while kneeling.',
    why: 'Improves core stability and balance, strengthens lower back, and enhances body coordination.',
    how: 'Start on hands and knees. Extend opposite arm and leg in straight line. Hold briefly. Return and switch sides. Keep hips level throughout.'
  },
  'V-Ups': {
    what: 'An advanced ab exercise bringing knees and chest together.',
    why: 'Intense core builder that targets entire abdominal wall for maximum muscle development.',
    how: 'Lie flat with arms overhead. Simultaneously lift legs and torso, reaching hands to feet forming V-shape. Lower with control and repeat.'
  },
  'Plank to Downward Dog': {
    what: 'A dynamic movement transitioning between plank and pike position.',
    why: 'Strengthens core while mobilizing shoulders and hamstrings, perfect for functional core development.',
    how: 'Start in plank. Press hips up and back into downward dog position. Return to plank. Move with control, keeping core engaged throughout.'
  },
  'Flutter Kicks': {
    what: 'A dynamic lower ab exercise with small kicking motions.',
    why: 'Targets lower abdominals intensely, builds hip flexor endurance, and improves core stamina.',
    how: 'Lie on back, lift legs slightly off ground. Alternate small, quick kicks up and down. Keep lower back pressed to floor throughout.'
  },
  'Spiderman Plank': {
    what: 'A plank variation bringing knee toward elbow on same side.',
    why: 'Works obliques intensely while building shoulder stability and rotational core strength.',
    how: 'Hold plank position. Bring knee toward same-side elbow. Return leg. Alternate sides. Keep hips level and move with control.'
  },
  'Toe Touch Crunches': {
    what: 'An upper ab exercise reaching toward lifted toes.',
    why: 'Intensely targets upper abs for defined, strong abdominal muscles.',
    how: 'Lie on back with legs straight up. Reach hands toward toes, lifting shoulders off ground. Lower with control. Keep legs vertical throughout.'
  },
  'Superman Hold': {
    what: 'A lower back strengthening exercise lifting arms and legs while lying prone.',
    why: 'Strengthens often-neglected lower back and glutes, improves posture and balances core development.',
    how: 'Lie face down. Simultaneously lift arms, chest, and legs off ground. Hold position squeezing glutes and lower back. Keep neck neutral.'
  },

  // Flexibility & Mobility Exercises
  'Hamstring Stretch': {
    what: 'A fundamental stretch targeting the back of the thighs.',
    why: 'Relieves tightness in hamstrings, improves flexibility, and reduces lower back tension.',
    how: 'Sit with one leg extended straight. Reach toward toes of extended leg. Hold for 20-30 seconds. Keep back relatively straight and breathe deeply.'
  },
  'Cobra Pose': {
    what: 'A yoga backbend that opens the chest and stretches the spine.',
    why: 'Counteracts sitting posture, strengthens back muscles, and improves spinal flexibility.',
    how: 'Lie face down, hands under shoulders. Press up straightening arms. Lift chest while keeping hips on ground. Look up gently, breathe deeply.'
  },
  'Downward Dog': {
    what: 'A yoga pose forming an inverted V-shape with the body.',
    why: 'Stretches hamstrings, calves, and shoulders while building upper body strength.',
    how: 'Start on hands and knees. Lift hips high, straighten legs. Press hands into ground, reach heels down. Create straight line from hands to hips.'
  },
  'Hip Flexor Stretch': {
    what: 'A lunge-style stretch targeting the front of the hips.',
    why: 'Releases tight hip flexors from sitting, improves hip mobility, and reduces lower back pain.',
    how: 'Kneel on one knee, other foot forward. Push hips forward gently. Feel stretch in front of back leg hip. Keep torso upright.'
  },
  'Child Pose': {
    what: 'A restful yoga pose with knees bent and arms extended forward.',
    why: 'Gently stretches lower back, hips, and shoulders while promoting relaxation and stress relief.',
    how: 'Kneel on floor, sit back on heels. Extend arms forward, lower chest toward thighs. Rest forehead on floor. Breathe deeply and relax.'
  },
  'Shoulder Rolls': {
    what: 'A gentle mobility exercise rotating the shoulders.',
    why: 'Relieves shoulder tension, improves shoulder mobility, and reduces stiffness from desk work.',
    how: 'Stand or sit tall. Slowly roll shoulders backward in large circles. Repeat forward. Move smoothly through full range of motion.'
  },
  'Cat-Cow Stretch': {
    what: 'A flowing spinal movement alternating between arch and curve.',
    why: 'Mobilizes entire spine, relieves back tension, and improves spinal flexibility and awareness.',
    how: 'Start on hands and knees. Arch back looking up (cow). Round spine looking down (cat). Flow between positions with breath.'
  },
  'Seated Forward Fold': {
    what: 'A deep hamstring and back stretch while seated.',
    why: 'Deeply stretches entire back body, calms nervous system, and improves forward bending flexibility.',
    how: 'Sit with legs extended. Hinge at hips to fold forward reaching toward feet. Hold for 30-60 seconds. Breathe into the stretch.'
  },
  'Pigeon Pose': {
    what: 'A deep hip stretch with one leg bent forward.',
    why: 'Releases deep hip tension, improves hip flexibility, and addresses tightness from prolonged sitting.',
    how: 'From all fours, bring one knee forward bent. Extend other leg straight back. Lower hips down. Hold and breathe into stretch.'
  },
  'Thread the Needle': {
    what: 'A gentle shoulder and upper back stretch performed on all fours.',
    why: 'Releases shoulder and upper back tension, improves spinal rotation mobility.',
    how: 'On hands and knees, thread one arm under body reaching across. Lower shoulder to floor. Hold and breathe. Switch sides.'
  },
  'Quad Stretch': {
    what: 'A standing stretch pulling foot toward glutes.',
    why: 'Stretches front thigh muscles, improves knee flexibility, and balances leg development.',
    how: 'Stand on one leg. Bend other knee bringing heel toward glutes. Hold foot with hand. Keep knees together and stand tall.'
  },
  'Chest Opener Stretch': {
    what: 'A stretch interlacing hands behind back to open chest.',
    why: 'Counteracts rounded shoulder posture, opens chest, and improves shoulder flexibility.',
    how: 'Stand tall. Interlace fingers behind back. Straighten arms and lift hands away from body. Squeeze shoulder blades together. Breathe deeply.'
  },
  'Butterfly Stretch': {
    what: 'A seated stretch with soles of feet together.',
    why: 'Opens hips and inner thighs, improves groin flexibility, and prepares for deeper hip stretches.',
    how: 'Sit with soles of feet together, knees out. Hold feet with hands. Gently press knees toward floor. Keep back straight, lean forward if able.'
  },
  'Neck Rolls': {
    what: 'A gentle mobility exercise rotating the head and neck.',
    why: 'Relieves neck tension, improves cervical mobility, and reduces stiffness from screen time.',
    how: 'Sit or stand tall. Slowly roll head in circular motion. Make smooth, controlled circles. Reverse direction. Keep shoulders relaxed.'
  },
  'Standing Side Stretch': {
    what: 'A lateral bend stretch reaching arm overhead.',
    why: 'Stretches side body and obliques, improves lateral flexibility, and relieves side tension.',
    how: 'Stand with feet hip-width. Reach one arm overhead. Bend to opposite side, lengthening side body. Hold and breathe. Switch sides.'
  },

  // Endurance Exercises
  'Skater Jumps (Endurance)': {
    what: 'Lateral jumping exercise mimicking speed skating for stamina.',
    why: 'Builds cardiovascular endurance while improving lateral agility and leg stamina.',
    how: 'Leap side to side on alternating legs. Push off powerfully with each jump. Maintain rhythm for extended duration without stopping.'
  },
  'High Knees': {
    what: 'Running in place with knees lifted to hip height.',
    why: 'Excellent cardio endurance builder that strengthens legs while improving speed and stamina.',
    how: 'Run in place lifting knees high. Pump arms vigorously. Maintain fast pace for duration to build endurance.'
  },
  'Jump Rope': {
    what: 'Classic rhythmic jumping exercise with rope.',
    why: 'One of the best endurance builders, improves coordination and cardiovascular capacity.',
    how: 'Jump continuously with both feet or alternating. Maintain steady rhythm. Focus on consistent pace rather than speed.'
  },
  'Burpees': {
    what: 'Full-body exercise combining multiple movements.',
    why: 'Ultimate endurance and conditioning exercise that builds stamina and total body strength.',
    how: 'Perform continuous repetitions: squat, plank, push-up, jump. Focus on maintaining pace throughout entire duration.'
  },
  'Sprint Intervals': {
    what: 'High-intensity running intervals alternating with recovery.',
    why: 'Dramatically improves speed and endurance, increases VO2 max and cardiovascular efficiency.',
    how: 'Sprint maximally for 20-30 seconds. Recover with light jogging or walking. Repeat multiple rounds building endurance over time.'
  },
  'Box Jumps': {
    what: 'Explosive jumping onto elevated platform.',
    why: 'Builds explosive power endurance, strengthens legs, and improves cardiovascular stamina.',
    how: 'Jump onto box or platform with both feet. Step down. Repeat continuously. Maintain safe form throughout duration.'
  },
  'Plank to Push-Up': {
    what: 'Transitioning between plank and push-up position repeatedly.',
    why: 'Builds upper body endurance while strengthening shoulders, core, and arms.',
    how: 'Start in plank. Press up to push-up position one arm at a time. Return to plank. Alternate leading arm. Continue for duration.'
  },
  'Shadow Boxing': {
    what: 'Throwing punches in the air with footwork.',
    why: 'Excellent cardio endurance builder while improving coordination and upper body endurance.',
    how: 'Throw various punches - jabs, crosses, hooks. Keep moving with light footwork. Maintain active movement throughout duration.'
  },
  'Tuck Jumps': {
    what: 'Explosive jumps bringing knees to chest.',
    why: 'Builds explosive endurance, strengthens legs, and dramatically improves cardiovascular capacity.',
    how: 'Jump explosively bringing knees toward chest. Land softly. Immediately repeat. Focus on maintaining height and form throughout set.'
  },
  'Long Jump Burpees': {
    what: 'Burpee variation with broad jump instead of vertical jump.',
    why: 'Enhances explosive endurance, builds leg power stamina, and challenges cardiovascular system.',
    how: 'Perform burpee but jump forward as far as possible instead of jumping up. Turn around. Repeat back. Continue alternating.'
  },
  'Alternating Lunges': {
    what: 'Continuous lunge exercise alternating legs.',
    why: 'Builds leg endurance, improves balance stamina, and strengthens lower body.',
    how: 'Lunge forward alternating legs continuously. Keep torso upright. Maintain steady pace throughout duration. Focus on control and endurance.'
  },
  'Inchworms': {
    what: 'Walking hands out to plank and back.',
    why: 'Full-body endurance builder that stretches hamstrings while strengthening core and shoulders.',
    how: 'Stand, fold forward. Walk hands out to plank. Walk feet to hands. Stand up. Repeat continuously maintaining smooth flow.'
  },
  'Fast Feet Shuffle': {
    what: 'Rapid lateral shuffling with quick foot movement.',
    why: 'Improves agility endurance, builds leg stamina, and enhances cardiovascular fitness.',
    how: 'Shuffle quickly side to side. Keep feet moving rapidly. Stay low with bent knees. Maintain quick tempo throughout duration.'
  },
  'Commando Crawl': {
    what: 'Low crawling exercise moving forward on forearms.',
    why: 'Builds total body endurance, core stamina, and mental toughness.',
    how: 'Start in plank. Crawl forward on forearms and toes. Keep body low. Continue crawling maintaining low position throughout distance.'
  },
  'Jumping Lunges': {
    what: 'Explosive lunge exercise with midair leg switch.',
    why: 'Builds explosive leg endurance, improves cardiovascular capacity, and strengthens entire lower body.',
    how: 'Start in lunge. Jump explosively switching legs in air. Land in lunge on opposite leg. Continue alternating. Focus on explosiveness sustained over time.'
  },

  // General Fitness Exercises
  'Jumping Jacks': {
    what: 'Classic full-body exercise with jumping and arm movements.',
    why: 'Perfect warm-up that raises heart rate, improves coordination, and prepares body for exercise.',
    how: 'Jump feet wide while raising arms overhead. Jump back together bringing arms down. Maintain steady rhythm and controlled movements.'
  },
  'Bodyweight Squats': {
    what: 'Fundamental lower body exercise bending at hips and knees.',
    why: 'Strengthens legs and core, improves mobility, and builds functional fitness for daily activities.',
    how: 'Stand with feet shoulder-width. Lower hips back and down. Keep chest up and weight in heels. Stand back up squeezing glutes.'
  },
  'Arm Circles': {
    what: 'Simple shoulder mobility exercise rotating arms in circles.',
    why: 'Warms up shoulders, improves range of motion, and prepares upper body for activity.',
    how: 'Extend arms out to sides. Make small circles gradually growing larger. Reverse direction. Keep movements controlled and shoulders relaxed.'
  },
  'Jogging in Place': {
    what: 'Simple cardio exercise running without moving forward.',
    why: 'Easy way to warm up, raise heart rate, and improve cardiovascular fitness.',
    how: 'Run in place with natural stride. Pump arms naturally. Start slow and increase pace as you warm up.'
  },
  'Step Ups': {
    what: 'Alternating leg exercise stepping onto elevated surface.',
    why: 'Builds leg strength, improves balance, and creates functional lower body fitness.',
    how: 'Step up onto platform with one foot, bring other foot up. Step down. Alternate leading leg. Keep chest up throughout.'
  },
  'Wall Sit': {
    what: 'Isometric leg exercise holding squat position against wall.',
    why: 'Builds leg endurance, strengthens quads, and improves mental toughness.',
    how: 'Lean back against wall. Lower down until thighs parallel to ground. Hold position. Keep back flat against wall and breathe steadily.'
  },
  'Heel Raises': {
    what: 'Calf strengthening exercise rising onto toes.',
    why: 'Strengthens calves, improves ankle stability, and helps with balance.',
    how: 'Stand with feet hip-width. Rise up onto toes as high as possible. Lower down with control. Perform smoothly without bouncing.'
  },
  'Standing Side Bends': {
    what: 'Simple core exercise bending laterally at waist.',
    why: 'Stretches side body, improves lateral flexibility, and gently works obliques.',
    how: 'Stand feet hip-width. Reach one arm overhead. Bend to opposite side, sliding other hand down leg. Return to center. Alternate sides.'
  },
  'Push-Ups': {
    what: 'Classic upper body exercise lowering and raising body from floor.',
    why: 'Builds chest, shoulders, triceps, and core strength using just bodyweight.',
    how: 'Start in plank, hands under shoulders. Lower chest to ground keeping body straight. Push back up. Modify on knees if needed.'
  },
  'Leg Swings': {
    what: 'Dynamic hip mobility exercise swinging leg forward and back.',
    why: 'Warms up hips, improves dynamic flexibility, and prepares legs for activity.',
    how: 'Hold wall for balance. Swing one leg forward and back with control. Keep supporting leg straight. Complete reps then switch legs.'
  },
  'Glute Bridge': {
    what: 'Hip extension exercise lifting hips from floor.',
    why: 'Strengthens glutes and hamstrings, improves hip mobility, and supports lower back health.',
    how: 'Lie on back with knees bent, feet flat. Lift hips up squeezing glutes. Lower with control. Keep core engaged throughout.'
  },
  'Torso Twists': {
    what: 'Rotational exercise twisting upper body side to side.',
    why: 'Improves spinal mobility, warms up core, and enhances rotational flexibility.',
    how: 'Stand with feet wide, hands at chest or overhead. Rotate torso side to side. Keep hips stable and move from core.'
  },
  'Bear Crawl': {
    what: 'Moving on hands and feet with knees off ground.',
    why: 'Full-body exercise that builds coordination, strength, and functional fitness.',
    how: 'Start on hands and feet with knees hovering. Crawl forward moving opposite hand and foot. Keep back flat and core tight.'
  },
  'Shoulder Shrugs': {
    what: 'Simple upper back exercise raising shoulders toward ears.',
    why: 'Releases shoulder tension, strengthens upper traps, and improves shoulder awareness.',
    how: 'Stand tall with relaxed arms. Lift shoulders straight up toward ears. Hold briefly. Lower down slowly. Avoid rolling shoulders.'
  },
  'Standing Knee Raises': {
    what: 'Balance exercise lifting knee toward chest.',
    why: 'Improves balance, strengthens hip flexors, and builds single-leg stability.',
    how: 'Stand on one leg. Lift opposite knee toward chest. Hold briefly. Lower with control. Complete reps then switch legs.'
  },
};

async function updateExercises() {
  try {
    console.log('Starting to add motivational content to exercises...\n');

    // Update Weight Loss exercises
    console.log('Updating Weight Loss exercises...');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const exercise = await WeightLoss.findOne({ title });
      if (exercise) {
        await WeightLoss.updateOne(
          { title },
          { $set: { what: content.what, why: content.why, how: content.how } }
        );
        console.log(`✓ Updated: ${title}`);
      }
    }

    // Update Muscle Gain exercises
    console.log('\nUpdating Muscle Gain exercises...');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const exercise = await MuscleGain.findOne({ title });
      if (exercise) {
        await MuscleGain.updateOne(
          { title },
          { $set: { what: content.what, why: content.why, how: content.how } }
        );
        console.log(`✓ Updated: ${title}`);
      }
    }

    // Update Core Strength exercises
    console.log('\nUpdating Core Strength exercises...');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const exercise = await CoreStrength.findOne({ title });
      if (exercise) {
        await CoreStrength.updateOne(
          { title },
          { $set: { what: content.what, why: content.why, how: content.how } }
        );
        console.log(`✓ Updated: ${title}`);
      }
    }

    // Update Flexibility & Mobility exercises
    console.log('\nUpdating Flexibility & Mobility exercises...');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const exercise = await FlexibilityMobility.findOne({ title });
      if (exercise) {
        await FlexibilityMobility.updateOne(
          { title },
          { $set: { what: content.what, why: content.why, how: content.how } }
        );
        console.log(`✓ Updated: ${title}`);
      }
    }

    // Update Endurance exercises
    console.log('\nUpdating Endurance exercises...');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const exercise = await Endurance.findOne({ title });
      if (exercise) {
        await Endurance.updateOne(
          { title },
          { $set: { what: content.what, why: content.why, how: content.how } }
        );
        console.log(`✓ Updated: ${title}`);
      }
    }

    // Update General Fitness exercises
    console.log('\nUpdating General Fitness exercises...');
    for (const [title, content] of Object.entries(motivationalContent)) {
      const exercise = await GeneralFitness.findOne({ title });
      if (exercise) {
        await GeneralFitness.updateOne(
          { title },
          { $set: { what: content.what, why: content.why, how: content.how } }
        );
        console.log(`✓ Updated: ${title}`);
      }
    }

    console.log('\n✅ All exercises updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating exercises:', error);
    process.exit(1);
  }
}

updateExercises();
