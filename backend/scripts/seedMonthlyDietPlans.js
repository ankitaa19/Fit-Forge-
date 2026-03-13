const mongoose = require('mongoose');
require('dotenv').config();

const DietWeightLoss = require('../models/DietWeightLoss');
const DietMuscleGain = require('../models/DietMuscleGain');
const DietGeneralFitness = require('../models/DietGeneralFitness');
const DietEndurance = require('../models/DietEndurance');
const DietFlexibilityMobility = require('../models/DietFlexibilityMobility');
const DietCoreStrength = require('../models/DietCoreStrength');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

// Weight Loss meal database (calorie-controlled)
const weightLossMeals = {
  breakfast: [
    { name: 'Greek yogurt parfait with berries and granola', calories: 280, protein: 20, carbs: 35, fat: 6 },
    { name: 'Oatmeal with protein powder and banana', calories: 320, protein: 18, carbs: 48, fat: 8 },
    { name: 'Scrambled eggs with whole wheat toast and avocado', calories: 320, protein: 18, carbs: 28, fat: 14 },
    { name: 'Smoothie bowl with banana, spinach, and chia seeds', calories: 290, protein: 15, carbs: 42, fat: 8 },
    { name: 'Cottage cheese with fresh fruit and almonds', calories: 310, protein: 22, carbs: 30, fat: 10 }
  ],
  midMorningSnack: [
    { name: 'Apple slices with almond butter', calories: 170, protein: 5, carbs: 22, fat: 9 },
    { name: 'Carrot sticks with hummus', calories: 140, protein: 6, carbs: 18, fat: 6 },
    { name: 'String cheese and whole grain crackers', calories: 190, protein: 12, carbs: 20, fat: 7 },
    { name: 'Protein shake with almond milk', calories: 180, protein: 20, carbs: 15, fat: 5 },
    { name: 'Mixed berries with Greek yogurt', calories: 150, protein: 12, carbs: 22, fat: 3 }
  ],
  lunch: [
    { name: 'Grilled chicken salad with mixed greens and vinaigrette', calories: 380, protein: 40, carbs: 20, fat: 14 },
    { name: 'Salmon with quinoa and roasted vegetables', calories: 420, protein: 45, carbs: 25, fat: 15 },
    { name: 'Turkey and avocado wrap with side salad', calories: 410, protein: 38, carbs: 32, fat: 16 },
    { name: 'Tuna poke bowl with brown rice', calories: 450, protein: 42, carbs: 35, fat: 14 },
    { name: 'Chicken breast with sweet potato and broccoli', calories: 430, protein: 44, carbs: 38, fat: 12 }
  ],
  eveningSnack: [
    { name: 'Air-popped popcorn', calories: 120, protein: 4, carbs: 24, fat: 2 },
    { name: 'Cucumber slices with tzatziki', calories: 100, protein: 5, carbs: 12, fat: 4 },
    { name: 'Rice cakes with peanut butter', calories: 180, protein: 7, carbs: 22, fat: 8 },
    { name: 'Cherry tomatoes with mozzarella', calories: 150, protein: 10, carbs: 8, fat: 9 },
    { name: 'Edamame', calories: 130, protein: 12, carbs: 10, fat: 5 }
  ],
  dinner: [
    { name: 'Baked cod with cauliflower rice and green beans', calories: 360, protein: 42, carbs: 22, fat: 12 },
    { name: 'Ground turkey pasta with marinara sauce', calories: 400, protein: 38, carbs: 40, fat: 10 },
    { name: 'Grilled tilapia with asparagus and quinoa', calories: 380, protein: 40, carbs: 32, fat: 12 },
    { name: 'Chicken stir-fry with vegetables and brown rice', calories: 420, protein: 42, carbs: 38, fat: 14 },
    { name: 'Turkey meatballs with zucchini noodles', calories: 350, protein: 38, carbs: 24, fat: 14 }
  ]
};

// Muscle Gain meal database (high protein, higher calories)
const muscleGainMeals = {
  breakfast: [
    { name: 'Protein pancakes with maple syrup and berries', calories: 480, protein: 32, carbs: 52, fat: 14 },
    { name: 'Steak and eggs with hash browns', calories: 550, protein: 42, carbs: 45, fat: 22 },
    { name: 'French toast with eggs and turkey bacon', calories: 520, protein: 38, carbs: 48, fat: 18 },
    { name: 'Breakfast burrito with eggs, cheese, and sausage', calories: 560, protein: 36, carbs: 42, fat: 26 },
    { name: 'Greek yogurt bowl with granola and honey', calories: 450, protein: 32, carbs: 50, fat: 14 }
  ],
  midMorningSnack: [
    { name: 'Protein bar with banana', calories: 320, protein: 20, carbs: 38, fat: 10 },
    { name: 'Mass gainer shake', calories: 400, protein: 35, carbs: 50, fat: 8 },
    { name: 'Peanut butter sandwich on whole wheat', calories: 380, protein: 16, carbs: 42, fat: 18 },
    { name: 'Trail mix with nuts and dried fruit', calories: 350, protein: 12, carbs: 40, fat: 18 },
    { name: 'Cottage cheese with pineapple', calories: 280, protein: 28, carbs: 32, fat: 4 }
  ],
  lunch: [
    { name: 'Double chicken burrito with rice and beans', calories: 780, protein: 60, carbs: 85, fat: 22 },
    { name: 'Beef stir-fry with noodles and vegetables', calories: 720, protein: 52, carbs: 68, fat: 24 },
    { name: 'Grilled salmon with quinoa and avocado', calories: 680, protein: 50, carbs: 58, fat: 24 },
    { name: 'Pasta with meatballs and marinara sauce', calories: 750, protein: 58, carbs: 78, fat: 20 },
    { name: 'Teriyaki chicken with white rice and edamame', calories: 700, protein: 54, carbs: 76, fat: 16 }
  ],
  eveningSnack: [
    { name: 'Protein smoothie with banana and oats', calories: 380, protein: 30, carbs: 48, fat: 8 },
    { name: 'Whole grain toast with avocado and eggs', calories: 420, protein: 22, carbs: 36, fat: 22 },
    { name: 'Greek yogurt with granola and berries', calories: 340, protein: 24, carbs: 45, fat: 8 },
    { name: 'Protein muffin with almond butter', calories: 360, protein: 18, carbs: 42, fat: 14 },
    { name: 'Chicken breast slices with crackers', calories: 320, protein: 28, carbs: 30, fat: 8 }
  ],
  dinner: [
    { name: 'Grilled steak with sweet potato and asparagus', calories: 680, protein: 48, carbs: 58, fat: 22 },
    { name: 'Salmon with quinoa and roasted broccoli', calories: 620, protein: 46, carbs: 54, fat: 20 },
    { name: 'Chicken breast with pasta and pesto', calories: 690, protein: 52, carbs: 68, fat: 18 },
    { name: 'Lamb chops with mashed potatoes and green beans', calories: 720, protein: 50, carbs: 60, fat: 26 },
    { name: 'Turkey meatloaf with roasted potatoes', calories: 640, protein: 50, carbs: 58, fat: 18 }
  ]
};

// General Fitness meal database (balanced, moderate calories)
const generalFitnessMeals = {
  breakfast: [
    { name: 'Whole grain toast with avocado and poached eggs', calories: 380, protein: 16, carbs: 38, fat: 18 },
    { name: 'Oatmeal with mixed berries and almonds', calories: 340, protein: 12, carbs: 48, fat: 12 },
    { name: 'Greek yogurt with granola and fruit', calories: 360, protein: 18, carbs: 45, fat: 10 },
    { name: 'Smoothie with banana, spinach, and protein powder', calories: 320, protein: 22, carbs: 40, fat: 8 },
    { name: 'Scrambled eggs with whole wheat toast', calories: 350, protein: 20, carbs: 32, fat: 14 }
  ],
  midMorningSnack: [
    { name: 'Mixed nuts and dried fruit', calories: 200, protein: 6, carbs: 24, fat: 10 },
    { name: 'Protein smoothie', calories: 240, protein: 20, carbs: 28, fat: 6 },
    { name: 'Apple with peanut butter', calories: 180, protein: 5, carbs: 26, fat: 8 },
    { name: 'Granola bar with yogurt', calories: 220, protein: 8, carbs: 32, fat: 7 },
    { name: 'Veggies with ranch dip', calories: 160, protein: 4, carbs: 18, fat: 9 }
  ],
  lunch: [
    { name: 'Grilled chicken wrap with vegetables', calories: 480, protein: 38, carbs: 45, fat: 16 },
    { name: 'Turkey and cheese sandwich with fruit', calories: 450, protein: 32, carbs: 52, fat: 14 },
    { name: 'Salmon salad with mixed greens and quinoa', calories: 520, protein: 40, carbs: 42, fat: 20 },
    { name: 'Chicken stir-fry with brown rice', calories: 500, protein: 42, carbs: 55, fat: 12 },
    { name: 'Tuna wrap with vegetables and hummus', calories: 460, protein: 36, carbs: 48, fat: 14 }
  ],
  eveningSnack: [
    { name: 'Protein shake', calories: 220, protein: 25, carbs: 20, fat: 6 },
    { name: 'Greek yogurt with berries', calories: 180, protein: 18, carbs: 22, fat: 4 },
    { name: 'Hard-boiled eggs with almonds', calories: 210, protein: 16, carbs: 8, fat: 14 },
    { name: 'Protein bar', calories: 240, protein: 20, carbs: 26, fat: 8 },
    { name: 'Cottage cheese with pineapple', calories: 190, protein: 20, carbs: 24, fat: 2 }
  ],
  dinner: [
    { name: 'Baked chicken with roasted vegetables and rice', calories: 540, protein: 42, carbs: 52, fat: 16 },
    { name: 'Fish tacos with cabbage slaw and beans', calories: 480, protein: 36, carbs: 55, fat: 14 },
    { name: 'Lean beef with sweet potato and broccoli', calories: 560, protein: 44, carbs: 50, fat: 20 },
    { name: 'Shrimp pasta with garlic and vegetables', calories: 520, protein: 38, carbs: 58, fat: 14 },
    { name: 'Turkey chili with cornbread', calories: 500, protein: 40, carbs: 54, fat: 16 }
  ]
};

// Endurance meal database (carb-focused for energy)
const enduranceMeals = {
  breakfast: [
    { name: 'Whole grain bagel with peanut butter and banana', calories: 420, protein: 14, carbs: 68, fat: 12 },
    { name: 'Oatmeal with honey, raisins, and walnuts', calories: 380, protein: 12, carbs: 62, fat: 10 },
    { name: 'Energy smoothie with oats, banana, and berries', calories: 360, protein: 14, carbs: 60, fat: 8 },
    { name: 'Whole wheat pancakes with maple syrup', calories: 440, protein: 12, carbs: 75, fat: 10 },
    { name: 'Granola with yogurt and fresh fruit', calories: 400, protein: 16, carbs: 65, fat: 10 }
  ],
  midMorningSnack: [
    { name: 'Energy bar with dates and nuts', calories: 240, protein: 6, carbs: 38, fat: 8 },
    { name: 'Banana with almond butter', calories: 220, protein: 6, carbs: 32, fat: 9 },
    { name: 'Trail mix with chocolate chips', calories: 260, protein: 7, carbs: 32, fat: 12 },
    { name: 'Rice cakes with honey', calories: 180, protein: 4, carbs: 36, fat: 2 },
    { name: 'Fruit and nut energy balls', calories: 200, protein: 5, carbs: 28, fat: 8 }
  ],
  lunch: [
    { name: 'Pasta with chicken and vegetables', calories: 620, protein: 38, carbs: 80, fat: 14 },
    { name: 'Rice bowl with tofu and mixed vegetables', calories: 580, protein: 28, carbs: 88, fat: 12 },
    { name: 'Chicken and sweet potato power bowl', calories: 600, protein: 40, carbs: 75, fat: 14 },
    { name: 'Tuna sandwich with fruit and pretzels', calories: 560, protein: 32, carbs: 82, fat: 12 },
    { name: 'Turkey wrap with chips and fruit', calories: 590, protein: 34, carbs: 78, fat: 16 }
  ],
  eveningSnack: [
    { name: 'Whole grain crackers with cheese', calories: 240, protein: 10, carbs: 30, fat: 10 },
    { name: 'Fruit smoothie with granola', calories: 280, protein: 8, carbs: 52, fat: 6 },
    { name: 'Bagel thin with cream cheese', calories: 220, protein: 8, carbs: 36, fat: 6 },
    { name: 'Pretzels with peanut butter', calories: 260, protein: 10, carbs: 38, fat: 8 },
    { name: 'Apple slices with caramel dip', calories: 200, protein: 2, carbs: 42, fat: 4 }
  ],
  dinner: [
    { name: 'Spaghetti with lean meat sauce and garlic bread', calories: 680, protein: 36, carbs: 92, fat: 18 },
    { name: 'Grilled salmon with wild rice and vegetables', calories: 620, protein: 42, carbs: 70, fat: 20 },
    { name: 'Chicken teriyaki with brown rice and edamame', calories: 650, protein: 44, carbs: 78, fat: 16 },
    { name: 'Beef and vegetable stir-fry with noodles', calories: 680, protein: 40, carbs: 82, fat: 20 },
    { name: 'Turkey and quinoa stuffed peppers', calories: 600, protein: 38, carbs: 75, fat: 14 }
  ]
};

// Flexibility & Mobility meal database (anti-inflammatory focus)
const flexibilityMobilityMeals = {
  breakfast: [
    { name: 'Avocado toast with poached eggs', calories: 360, protein: 16, carbs: 36, fat: 18 },
    { name: 'Greek yogurt bowl with chia seeds and berries', calories: 320, protein: 20, carbs: 38, fat: 10 },
    { name: 'Green smoothie with spinach, banana, and protein', calories: 300, protein: 18, carbs: 42, fat: 6 },
    { name: 'Oatmeal with flaxseed and blueberries', calories: 330, protein: 12, carbs: 48, fat: 10 },
    { name: 'Whole grain cereal with almond milk and fruit', calories: 310, protein: 14, carbs: 46, fat: 8 }
  ],
  midMorningSnack: [
    { name: 'Hummus with vegetable sticks', calories: 150, protein: 6, carbs: 18, fat: 7 },
    { name: 'Almonds and dried cranberries', calories: 180, protein: 6, carbs: 20, fat: 10 },
    { name: 'Protein smoothie with berries', calories: 200, protein: 18, carbs: 24, fat: 4 },
    { name: 'Rice cakes with avocado', calories: 170, protein: 4, carbs: 22, fat: 8 },
    { name: 'Fruit salad with chia seeds', calories: 160, protein: 4, carbs: 30, fat: 4 }
  ],
  lunch: [
    { name: 'Mediterranean salad with grilled chicken', calories: 420, protein: 36, carbs: 32, fat: 18 },
    { name: 'Quinoa bowl with roasted vegetables and tahini', calories: 450, protein: 16, carbs: 52, fat: 20 },
    { name: 'Salmon salad with avocado and mixed greens', calories: 480, protein: 38, carbs: 28, fat: 26 },
    { name: 'Buddha bowl with chickpeas and tahini dressing', calories: 460, protein: 18, carbs: 56, fat: 18 },
    { name: 'Tuna poke bowl with seaweed salad', calories: 440, protein: 36, carbs: 40, fat: 16 }
  ],
  eveningSnack: [
    { name: 'Turmeric latte with almond milk', calories: 140, protein: 4, carbs: 20, fat: 5 },
    { name: 'Cucumber slices with guacamole', calories: 120, protein: 3, carbs: 12, fat: 8 },
    { name: 'Mixed berries with coconut yogurt', calories: 160, protein: 6, carbs: 26, fat: 5 },
    { name: 'Celery sticks with almond butter', calories: 150, protein: 5, carbs: 15, fat: 9 },
    { name: 'Green tea and dark chocolate', calories: 130, protein: 2, carbs: 18, fat: 7 }
  ],
  dinner: [
    { name: 'Baked salmon with quinoa and roasted vegetables', calories: 520, protein: 40, carbs: 44, fat: 22 },
    { name: 'Stir-fried tofu with vegetables and brown rice', calories: 460, protein: 24, carbs: 58, fat: 16 },
    { name: 'Chicken breast with roasted sweet potato and greens', calories: 490, protein: 42, carbs: 48, fat: 14 },
    { name: 'Grilled fish tacos with cabbage slaw', calories: 450, protein: 36, carbs: 42, fat: 18 },
    { name: 'Vegetable curry with chickpeas and rice', calories: 480, protein: 18, carbs: 68, fat: 16 }
  ]
};

// Core Strength meal database (balanced with good protein)
const coreStrengthMeals = {
  breakfast: [
    { name: 'Protein omelet with vegetables and toast', calories: 400, protein: 28, carbs: 36, fat: 16 },
    { name: 'Protein oatmeal with nuts and banana', calories: 380, protein: 22, carbs: 52, fat: 12 },
    { name: 'Greek yogurt parfait with granola', calories: 360, protein: 24, carbs: 44, fat: 10 },
    { name: 'Egg white scramble with turkey sausage', calories: 340, protein: 32, carbs: 24, fat: 14 },
    { name: 'Protein smoothie bowl with toppings', calories: 390, protein: 26, carbs: 48, fat: 10 }
  ],
  midMorningSnack: [
    { name: 'Protein shake with almond butter', calories: 280, protein: 28, carbs: 22, fat: 10 },
    { name: 'Hard-boiled eggs with whole grain crackers', calories: 240, protein: 18, carbs: 20, fat: 10 },
    { name: 'Greek yogurt with protein granola', calories: 260, protein: 22, carbs: 28, fat: 8 },
    { name: 'Turkey roll-ups with cheese', calories: 220, protein: 24, carbs: 8, fat: 12 },
    { name: 'Protein bar with apple', calories: 270, protein: 20, carbs: 32, fat: 8 }
  ],
  lunch: [
    { name: 'Grilled chicken with quinoa and vegetables', calories: 520, protein: 46, carbs: 48, fat: 14 },
    { name: 'Turkey and avocado wrap with fruit', calories: 480, protein: 38, carbs: 50, fat: 16 },
    { name: 'Salmon bowl with brown rice and edamame', calories: 560, protein: 44, carbs: 54, fat: 20 },
    { name: 'Chicken stir-fry with vegetables and rice', calories: 540, protein: 42, carbs: 58, fat: 14 },
    { name: 'Tuna salad with whole grain crackers', calories: 460, protein: 38, carbs: 42, fat: 18 }
  ],
  eveningSnack: [
    { name: 'Cottage cheese with berries', calories: 190, protein: 22, carbs: 20, fat: 4 },
    { name: 'Protein pudding with almonds', calories: 220, protein: 20, carbs: 24, fat: 8 },
    { name: 'Tuna on rice cakes', calories: 210, protein: 24, carbs: 18, fat: 6 },
    { name: 'Chicken breast with vegetables', calories: 240, protein: 28, carbs: 16, fat: 8 },
    { name: 'Greek yogurt with honey', calories: 200, protein: 20, carbs: 26, fat: 4 }
  ],
  dinner: [
    { name: 'Grilled chicken breast with roasted vegetables', calories: 480, protein: 48, carbs: 36, fat: 16 },
    { name: 'Baked salmon with quinoa and asparagus', calories: 540, protein: 44, carbs: 48, fat: 20 },
    { name: 'Turkey meatballs with whole wheat pasta', calories: 560, protein: 46, carbs: 56, fat: 16 },
    { name: 'Lean steak with sweet potato and broccoli', calories: 580, protein: 50, carbs: 48, fat: 22 },
    { name: 'Grilled fish with wild rice and green beans', calories: 500, protein: 42, carbs: 52, fat: 14 }
  ]
};

// Hydration tips
const hydrationTips = [
  'Drink 8-10 glasses (2-2.5 liters) of water throughout the day',
  'Start your day with a glass of water to kickstart metabolism',
  'Drink water 30 minutes before meals for better digestion',
  'Keep a water bottle with you and sip regularly throughout the day',
  'Rehydrate with 2-3 glasses of water after your workout',
  'Infuse water with lemon, cucumber, or mint for added flavor',
  'Monitor your urine color - pale yellow indicates good hydration',
  'Drink water when you feel hungry to check if you\'re actually thirsty',
  'Increase water intake during hot weather or intense workouts',
  'Drink herbal teas to add variety to your hydration routine',
  'Set reminders on your phone to drink water every hour',
  'Eat water-rich foods like cucumbers, watermelon, and oranges',
  'Drink coconut water post-workout for natural electrolytes',
  'Avoid excessive caffeine and alcohol as they can dehydrate you',
  'Drink a glass of water before and after each meal',
  'Keep track of your daily water intake with an app or journal',
  'Add a pinch of sea salt to water for electrolyte balance during intense training',
  'Drink cold water to boost metabolism slightly',
  'Have a glass of water before bedtime, but not too much to avoid sleep disruption',
  'Match each cup of coffee with an extra glass of water',
  'Drink water at room temperature for better absorption',
  'Add fresh fruit slices to your water for natural sweetness',
  'Freeze fruit in ice cubes for flavorful cold water',
  'Drink green tea for hydration plus antioxidants',
  'Stay ahead of thirst - if you feel thirsty, you\'re already slightly dehydrated',
  'Increase water intake if you\'re eating high-sodium foods',
  'Drink water while snacking to feel fuller and eat less',
  'Use a straw to make drinking water easier and more enjoyable',
  'Keep water accessible at your desk, in your car, and by your bed',
  'Drink sparkling water if you need variety from plain water',
  'Track your water intake with a marked water bottle'
];

// Nutrition tips
const nutritionTips = [
  'Eat protein with every meal to support muscle recovery and growth',
  'Include colorful vegetables for a variety of vitamins and minerals',
  'Don\'t skip breakfast - it kickstarts your metabolism for the day',
  'Meal prep on Sundays to stay on track during busy weekdays',
  'Chew slowly and mindfully to improve digestion and satisfaction',
  'Include healthy fats like avocado, nuts, and olive oil in your diet',
  'Aim for 5-6 small meals throughout the day to maintain energy',
  'Eat complex carbs before workouts for sustained energy',
  'Consume protein within 30-60 minutes after exercise for recovery',
  'Don\'t eliminate entire food groups unless medically necessary',
  'Read nutrition labels to be aware of hidden sugars and sodium',
  'Plan treats into your week to avoid feeling deprived',
  'Eat whole fruits instead of drinking fruit juice for more fiber',
  'Include fermented foods like yogurt for gut health',
  'Limit processed foods and focus on whole, natural ingredients',
  'Don\'t classify foods as "good" or "bad" - it\'s about balance',
  'Eat the rainbow - different colored foods provide different nutrients',
  'Include lean proteins in every meal for satiety and muscle maintenance',
  'Prepare healthy snacks in advance to avoid unhealthy choices',
  'Listen to your body\'s hunger and fullness cues',
  'Include omega-3 fatty acids from fish or flaxseeds for heart health',
  'Space meals 3-4 hours apart for optimal digestion and energy',
  'Don\'t eat while distracted - focus on your meal for better satisfaction',
  'Balance your plate: 1/2 vegetables, 1/4 protein, 1/4 complex carbs',
  'Cook at home more often to control ingredients and portions',
  'Include fiber-rich foods to support digestive health and satiety',
  'Moderate your caffeine intake and avoid it close to bedtime',
  'Add herbs and spices instead of salt for flavor without sodium',
  'Keep healthy emergency snacks available for unexpected hunger',
  'Stay flexible with your nutrition plan and adjust as needed',
  'Remember that consistency over time matters more than perfection'
];

// Function to generate diet plan for a specific day
function generateDayPlan(dayNumber, mealDatabase, hydrationTips, nutritionTips) {
  const getMeal = (category, index) => {
    const meals = mealDatabase[category];
    return meals[index % meals.length];
  };

  const getHydrationTip = (index) => {
    return hydrationTips[index % hydrationTips.length];
  };

  const getNutritionTip = (index) => {
    return nutritionTips[index % nutritionTips.length];
  };

  return {
    dayNumber,
    breakfast: getMeal('breakfast', dayNumber - 1),
    midMorningSnack: getMeal('midMorningSnack', dayNumber - 1),
    lunch: getMeal('lunch', dayNumber - 1),
    eveningSnack: getMeal('eveningSnack', dayNumber - 1),
    dinner: getMeal('dinner', dayNumber - 1),
    hydrationTip: getHydrationTip(dayNumber - 1),
    nutritionTip: getNutritionTip(dayNumber - 1)
  };
}

async function seedDietPlans() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('Clearing existing diet data...');
    await Promise.all([
      DietWeightLoss.deleteMany({}),
      DietMuscleGain.deleteMany({}),
      DietGeneralFitness.deleteMany({}),
      DietEndurance.deleteMany({}),
      DietFlexibilityMobility.deleteMany({}),
      DietCoreStrength.deleteMany({})
    ]);
    console.log('✅ Cleared existing data\n');

    // Generate and insert 31 days for each goal
    console.log('Seeding diet plans...\n');

    // Weight Loss
    console.log('📋 Seeding Weight Loss diet plans...');
    const weightLossPlans = [];
    for (let day = 1; day <= 31; day++) {
      weightLossPlans.push(generateDayPlan(day, weightLossMeals, hydrationTips, nutritionTips));
    }
    await DietWeightLoss.insertMany(weightLossPlans);
    console.log('✅ Weight Loss: 31 days seeded\n');

    // Muscle Gain
    console.log('📋 Seeding Muscle Gain diet plans...');
    const muscleGainPlans = [];
    for (let day = 1; day <= 31; day++) {
      muscleGainPlans.push(generateDayPlan(day, muscleGainMeals, hydrationTips, nutritionTips));
    }
    await DietMuscleGain.insertMany(muscleGainPlans);
    console.log('✅ Muscle Gain: 31 days seeded\n');

    // General Fitness
    console.log('📋 Seeding General Fitness diet plans...');
    const generalFitnessPlans = [];
    for (let day = 1; day <= 31; day++) {
      generalFitnessPlans.push(generateDayPlan(day, generalFitnessMeals, hydrationTips, nutritionTips));
    }
    await DietGeneralFitness.insertMany(generalFitnessPlans);
    console.log('✅ General Fitness: 31 days seeded\n');

    // Endurance
    console.log('📋 Seeding Endurance diet plans...');
    const endurancePlans = [];
    for (let day = 1; day <= 31; day++) {
      endurancePlans.push(generateDayPlan(day, enduranceMeals, hydrationTips, nutritionTips));
    }
    await DietEndurance.insertMany(endurancePlans);
    console.log('✅ Endurance: 31 days seeded\n');

    // Flexibility & Mobility
    console.log('📋 Seeding Flexibility & Mobility diet plans...');
    const flexibilityPlans = [];
    for (let day = 1; day <= 31; day++) {
      flexibilityPlans.push(generateDayPlan(day, flexibilityMobilityMeals, hydrationTips, nutritionTips));
    }
    await DietFlexibilityMobility.insertMany(flexibilityPlans);
    console.log('✅ Flexibility & Mobility: 31 days seeded\n');

    // Core Strength
    console.log('📋 Seeding Core Strength diet plans...');
    const coreStrengthPlans = [];
    for (let day = 1; day <= 31; day++) {
      coreStrengthPlans.push(generateDayPlan(day, coreStrengthMeals, hydrationTips, nutritionTips));
    }
    await DietCoreStrength.insertMany(coreStrengthPlans);
    console.log('✅ Core Strength: 31 days seeded\n');

    console.log('========================================');
    console.log('✅ All diet plans seeded successfully!');
    console.log('========================================');
    console.log('Total documents created: 186 (6 goals × 31 days)');
    console.log('\nCollections:');
    console.log('  • dietweightloss');
    console.log('  • dietmusclegain');
    console.log('  • dietgeneralfitness');
    console.log('  • dietendurance');
    console.log('  • dietflexibilitymobility');
    console.log('  • dietcorestrength');

  } catch (error) {
    console.error('❌ Error seeding diet plans:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
}

seedDietPlans();
