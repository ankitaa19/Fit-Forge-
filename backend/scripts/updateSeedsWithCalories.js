const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname, 'backend/scripts');

const seedFiles = [
  { file: 'seedMuscleGain.js', calories: 9 },
  { file: 'seedEndurance.js', calories: 10 },
  { file: 'seedGeneralFitness.js', calories: 8 },
  { file: 'seedFlexibilityMobility.js', calories: 5 },
  { file: 'seedCoreStrength.js', calories: 7 }
];

seedFiles.forEach(({ file, calories }) => {
  const filePath = path.join(BASE_PATH, file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('caloriesBurned:')) {
      // Replace exercises that don't have caloriesBurned
      // This pattern matches the last property before closing brace
      const regex = /(\s+)(recommended:\s*(true|false))\n(\s+)\}/g;
      
      content = content.replace(regex, `$1$2,\n$1caloriesBurned: ${calories}\n$4}`);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated ${file}`);
    } else {
      console.log(`⊘ Skipped ${file} (already has caloriesBurned)`);
    }
  } catch (err) {
    console.error(`✗ Error updating ${file}:`, err.message);
  }
});

console.log('\nDone!');
