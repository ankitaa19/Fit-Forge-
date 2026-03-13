const fs = require('fs');
const path = require('path');

const seedFiles = [
  'backend/scripts/seedMuscleGain.js',
  'backend/scripts/seedEndurance.js',
  'backend/scripts/seedGeneralFitness.js',
  'backend/scripts/seedFlexibilityMobility.js',
  'backend/scripts/seedCoreStrength.js'
];

const calorieValues = {
  'seedMuscleGain.js': 9,
  'seedEndurance.js': 10,
  'seedGeneralFitness.js': 8,
  'seedFlexibilityMobility.js': 5,
  'seedCoreStrength.js': 7
};

seedFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    const fileName = path.basename(file);
    const calories = calorieValues[fileName];
    
    // Add caloriesBurned: X, before closing braces of each exercise object
    // Pattern: Find lines with various last properties and add caloriesBurned before the closing }
    
    if (!content.includes("caloriesBurnedconst fs = require('fs');
const path = require('path');

const seedFiles = [
  'backet const path = require('pa(r
const seedFiles = [
  'back: f  'backend/scripts'[  'backend/scripts/seedEndurance.js',y:  'backend/scripts/seedGeneralFitnesAr  'backend/scripts/seedFlexibilityMobilites  'backend/scripts/seedCoreStrength.js'
];

coit];

const calorieValues = {
  'seedMusns
le.  'seedMuscleGain.js':;
  'se
  }
});
