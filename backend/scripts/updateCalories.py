#!/usr/bin/env python3
import re
import os

seed_files = {
    'backend/scripts/seedMuscleGain.js': 9,
    'backend/scripts/seedEndurance.js': 10,
    'backend/scripts/seedGeneralFitness.js': 8,
    'backend/scripts/seedFlexibilityMobility.js': 5,
    'backend/scripts/seedCoreStrength.js': 7
}

for file_path, calories in seed_files.items():
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if caloriesBurned already exists
        if 'caloriesBurned' not in content:
            # Replace pattern: last property line before closing brace
            pattern = r"((?:muscleGroup|exerciseType|category|focusArea|targetArea):\s*['\"][^'\"]*['\"])\n(\s*)\}"
            replacement = f"\\1,\n\\2caloriesBurned: {calories}\n\\2}}"
            
            new_content = re.sub(pattern, replacement, content)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"Updated {file_path}")
        else:
            print(f"Skipped {file_path} (caloriesBurned already exists)")
    else:
        print(f"File not found: {file_path}")

print("Done!")
