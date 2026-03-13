const express = require('express');
const router = express.Router();
const DietPlan = require('../models/DietPlan');
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');

// Diet plan database organized by fitness goal
const dietDatabase = {
  'Weight Loss': {
    breakfast: [
      { name: 'Oatmeal with protein powder, peanut butter, and banana', calories: 350, protein: 12, carbs: 54, fat: 9 },
      { name: 'Greek yogurt parfait with berries and granola', calories: 280, protein: 20, carbs: 35, fat: 6 },
      { name: 'Scrambled eggs with whole wheat toast and avocado', calories: 320, protein: 18, carbs: 28, fat: 14 },
      { name: 'Smoothie bowl with banana, spinach, and chia seeds', calories: 290, protein: 15, carbs: 42, fat: 8 },
      { name: 'Cottage cheese with fresh fruit and almonds', calories: 310, protein: 22, carbs: 30, fat: 10 },
      { name: 'Whole grain cereal with almond milk and berries', calories: 270, protein: 14, carbs: 38, fat: 7 },
      { name: 'Veggie omelet with turkey sausage', calories: 340, protein: 26, carbs: 18, fat: 16 },
    ],
    lunch: [
      { name: 'Salmon with quinoa and roasted vegetables', calories: 420, protein: 45, carbs: 25, fat: 15 },
      { name: 'Grilled chicken salad with mixed greens', calories: 380, protein: 40, carbs: 20, fat: 14 },
      { name: 'Turkey and avocado wrap with side salad', calories: 410, protein: 38, carbs: 32, fat: 16 },
      { name: 'Tuna poke bowl with brown rice', calories: 450, protein: 42, carbs: 35, fat: 14 },
      { name: 'Chicken breast with sweet potato and broccoli', calories: 430, protein: 44, carbs: 38, fat: 12 },
      { name: 'Shrimp stir-fry with vegetables and rice', calories: 400, protein: 36, carbs: 42, fat: 10 },
      { name: 'Lean beef burrito bowl with black beans', calories: 460, protein: 40, carbs: 45, fat: 15 },
    ],
    dinner: [
      { name: 'Ground turkey pasta with marinara sauce', calories: 480, protein: 38, carbs: 48, fat: 14 },
      { name: 'Baked cod with roasted vegetables', calories: 380, protein: 38, carbs: 18, fat: 18 },
      { name: 'Chicken breast with cauliflower rice and green beans', calories: 360, protein: 42, carbs: 22, fat: 12 },
      { name: 'Grilled tilapia with asparagus and quinoa', calories: 420, protein: 40, carbs: 35, fat: 14 },
      { name: 'Turkey meatballs with zucchini noodles', calories: 390, protein: 36, carbs: 28, fat: 16 },
      { name: 'Baked chicken thighs with Brussels sprouts', calories: 450, protein: 44, carbs: 24, fat: 20 },
      { name: 'Lean pork chops with roasted carrots and cabbage', calories: 410, protein: 38, carbs: 30, fat: 16 },
    ],
    snacks: [
      { name: 'Trail mix with dried fruits', calories: 180, protein: 6, carbs: 18, fat: 10 },
      { name: 'Protein shake with almond milk', calories: 220, protein: 25, carbs: 15, fat: 8 },
      { name: 'Apple slices with almond butter', calories: 170, protein: 5, carbs: 22, fat: 9 },
      { name: 'Carrot sticks with hummus', calories: 140, protein: 6, carbs: 18, fat: 6 },
      { name: 'String cheese and whole grain crackers', calories: 190, protein: 12, carbs: 20, fat: 7 },
    ],
  },
  'Muscle Gain': {
    breakfast: [
      { name: 'Protein pancakes with maple syrup and berries', calories: 480, protein: 32, carbs: 52, fat: 14 },
      { name: 'Egg white omelet with vegetables and toast', calories: 420, protein: 35, carbs: 28, fat: 18 },
      { name: 'Steak and eggs with hash browns', calories: 550, protein: 42, carbs: 45, fat: 22 },
      { name: 'French toast with eggs and turkey bacon', calories: 520, protein: 38, carbs: 48, fat: 18 },
      { name: 'Protein oatmeal with nuts and banana', calories: 480, protein: 30, carbs: 55, fat: 16 },
      { name: 'Breakfast burrito with eggs, cheese, and sausage', calories: 560, protein: 36, carbs: 42, fat: 26 },
      { name: 'Greek yogurt bowl with granola and honey', calories: 450, protein: 32, carbs: 50, fat: 14 },
    ],
    lunch: [
      { name: 'Chicken and brown rice bowl with vegetables', calories: 650, protein: 55, carbs: 72, fat: 12 },
      { name: 'Beef stir-fry with noodles and vegetables', calories: 720, protein: 52, carbs: 68, fat: 24 },
      { name: 'Double chicken burrito with rice and beans', calories: 780, protein: 60, carbs: 85, fat: 22 },
      { name: 'Grilled salmon with quinoa and avocado', calories: 680, protein: 50, carbs: 58, fat: 24 },
      { name: 'Pasta with meatballs and marinara sauce', calories: 750, protein: 58, carbs: 78, fat: 20 },
      { name: 'Teriyaki chicken with white rice and edamame', calories: 700, protein: 54, carbs: 76, fat: 16 },
      { name: 'Pulled pork sandwich with sweet potato fries', calories: 720, protein: 52, carbs: 70, fat: 22 },
    ],
    dinner: [
      { name: 'Grilled steak with sweet potato and asparagus', calories: 680, protein: 48, carbs: 58, fat: 22 },
      { name: 'Salmon with quinoa and roasted broccoli', calories: 620, protein: 46, carbs: 54, fat: 20 },
      { name: 'Chicken breast with pasta and pesto', calories: 690, protein: 52, carbs: 68, fat: 18 },
      { name: 'Lamb chops with mashed potatoes and green beans', calories: 720, protein: 50, carbs: 60, fat: 26 },
      { name: 'Beef and vegetable stew with bread', calories: 650, protein: 48, carbs: 62, fat: 20 },
      { name: 'Pork tenderloin with rice pilaf and carrots', calories: 680, protein: 46, carbs: 66, fat: 22 },
      { name: 'Turkey meatloaf with roasted potatoes', calories: 640, protein: 50, carbs: 58, fat: 18 },
    ],
    snacks: [
      { name: 'Protein bar with banana', calories: 320, protein: 20, carbs: 38, fat: 10 },
      { name: 'Mass gainer shake', calories: 400, protein: 35, carbs: 50, fat: 8 },
      { name: 'Peanut butter sandwich on whole wheat', calories: 380, protein: 16, carbs: 42, fat: 18 },
      { name: 'Greek yogurt with granola and honey', calories: 340, protein: 24, carbs: 45, fat: 8 },
      { name: 'Cottage cheese with pineapple', calories: 280, protein: 28, carbs: 32, fat: 4 },
    ],
  },
  'General Fitness': {
    breakfast: [
      { name: 'Whole grain toast with avocado and poached eggs', calories: 380, protein: 16, carbs: 38, fat: 18 },
      { name: 'Oatmeal with mixed berries and almonds', calories: 340, protein: 12, carbs: 48, fat: 12 },
      { name: 'Greek yogurt with granola and fruit', calories: 360, protein: 18, carbs: 45, fat: 10 },
      { name: 'Smoothie with banana, spinach, and protein powder', calories: 320, protein: 22, carbs: 40, fat: 8 },
      { name: 'Scrambled eggs with whole wheat toast', calories: 350, protein: 20, carbs: 32, fat: 14 },
      { name: 'Breakfast sandwich with egg, cheese, and turkey', calories: 390, protein: 24, carbs: 36, fat: 16 },
      { name: 'Protein waffles with berries and yogurt', calories: 410, protein: 26, carbs: 48, fat: 12 },
    ],
    lunch: [
      { name: 'Grilled chicken wrap with vegetables', calories: 480, protein: 38, carbs: 45, fat: 16 },
      { name: 'Turkey and cheese sandwich with fruit', calories: 450, protein: 32, carbs: 52, fat: 14 },
      { name: 'Salmon salad with mixed greens and quinoa', calories: 520, protein: 40, carbs: 42, fat: 20 },
      { name: 'Chicken stir-fry with brown rice', calories: 500, protein: 42, carbs: 55, fat: 12 },
      { name: 'Tuna wrap with vegetables and hummus', calories: 460, protein: 36, carbs: 48, fat: 14 },
      { name: 'Chicken Caesar salad with whole grain roll', calories: 490, protein: 38, carbs: 40, fat: 18 },
      { name: 'Veggie and chicken power bowl', calories: 510, protein: 40, carbs: 50, fat: 16 },
    ],
    dinner: [
      { name: 'Baked chicken with roasted vegetables and rice', calories: 540, protein: 42, carbs: 52, fat: 16 },
      { name: 'Fish tacos with cabbage slaw and beans', calories: 480, protein: 36, carbs: 55, fat: 14 },
      { name: 'Lean beef with sweet potato and broccoli', calories: 560, protein: 44, carbs: 50, fat: 20 },
      { name: 'Shrimp pasta with garlic and vegetables', calories: 520, protein: 38, carbs: 58, fat: 14 },
      { name: 'Turkey chili with cornbread', calories: 500, protein: 40, carbs: 54, fat: 16 },
      { name: 'Grilled tilapia with quinoa and asparagus', calories: 480, protein: 42, carbs: 46, fat: 14 },
      { name: 'Chicken fajitas with peppers and onions', calories: 540, protein: 44, carbs: 52, fat: 18 },
    ],
    snacks: [
      { name: 'Mixed nuts and dried fruit', calories: 200, protein: 6, carbs: 24, fat: 10 },
      { name: 'Protein smoothie', calories: 240, protein: 20, carbs: 28, fat: 6 },
      { name: 'Apple with peanut butter', calories: 180, protein: 5, carbs: 26, fat: 8 },
      { name: 'Granola bar with yogurt', calories: 220, protein: 8, carbs: 32, fat: 7 },
      { name: 'Veggies with ranch dip', calories: 160, protein: 4, carbs: 18, fat: 9 },
    ],
  },
  'Endurance': {
    breakfast: [
      { name: 'Whole grain bagel with peanut butter and banana', calories: 420, protein: 14, carbs: 68, fat: 12 },
      { name: 'Oatmeal with honey, raisins, and walnuts', calories: 380, protein: 12, carbs: 62, fat: 10 },
      { name: 'Energy smoothie with oats, banana, and berries', calories: 360, protein: 14, carbs: 60, fat: 8 },
      { name: 'Whole wheat pancakes with maple syrup', calories: 440, protein: 12, carbs: 75, fat: 10 },
      { name: 'Granola with yogurt and fresh fruit', calories: 400, protein: 16, carbs: 65, fat: 10 },
      { name: 'French toast with berries and honey', calories: 420, protein: 14, carbs: 68, fat: 12 },
      { name: 'Breakfast quinoa bowl with nuts and fruit', calories: 390, protein: 14, carbs: 62, fat: 11 },
    ],
    lunch: [
      { name: 'Pasta with chicken and vegetables', calories: 620, protein: 38, carbs: 80, fat: 14 },
      { name: 'Rice bowl with tofu and mixed vegetables', calories: 580, protein: 28, carbs: 88, fat: 12 },
      { name: 'Chicken and sweet potato power bowl', calories: 600, protein: 40, carbs: 75, fat: 14 },
      { name: 'Tuna sandwich with fruit and pretzels', calories: 560, protein: 32, carbs: 82, fat: 12 },
      { name: 'Turkey wrap with chips and fruit', calories: 590, protein: 34, carbs: 78, fat: 16 },
      { name: 'Veggie stir-fry with noodles', calories: 550, protein: 24, carbs: 85, fat: 14 },
      { name: 'Chicken burrito bowl with rice and beans', calories: 640, protein: 42, carbs: 82, fat: 16 },
    ],
    dinner: [
      { name: 'Spaghetti with lean meat sauce and garlic bread', calories: 680, protein: 36, carbs: 92, fat: 18 },
      { name: 'Grilled salmon with wild rice and vegetables', calories: 620, protein: 42, carbs: 70, fat: 20 },
      { name: 'Chicken teriyaki with brown rice and edamame', calories: 650, protein: 44, carbs: 78, fat: 16 },
      { name: 'Beef and vegetable stir-fry with noodles', calories: 680, protein: 40, carbs: 82, fat: 20 },
      { name: 'Turkey and quinoa stuffed peppers', calories: 600, protein: 38, carbs: 75, fat: 14 },
      { name: 'Baked chicken with pasta and marinara', calories: 640, protein: 42, carbs: 80, fat: 16 },
      { name: 'Fish with couscous and roasted vegetables', calories: 590, protein: 40, carbs: 72, fat: 14 },
    ],
    snacks: [
      { name: 'Energy bar with dates and nuts', calories: 240, protein: 6, carbs: 38, fat: 8 },
      { name: 'Banana with almond butter', calories: 220, protein: 6, carbs: 32, fat: 9 },
      { name: 'Trail mix with chocolate chips', calories: 260, protein: 7, carbs: 32, fat: 12 },
      { name: 'Rice cakes with honey', calories: 180, protein: 4, carbs: 36, fat: 2 },
      { name: 'Fruit and nut energy balls', calories: 200, protein: 5, carbs: 28, fat: 8 },
    ],
  },
  'Flexibility & Mobility': {
    breakfast: [
      { name: 'Avocado toast with poached eggs', calories: 360, protein: 16, carbs: 36, fat: 18 },
      { name: 'Greek yogurt bowl with chia seeds and berries', calories: 320, protein: 20, carbs: 38, fat: 10 },
      { name: 'Green smoothie with spinach, banana, and protein', calories: 300, protein: 18, carbs: 42, fat: 6 },
      { name: 'Oatmeal with flaxseed and blueberries', calories: 330, protein: 12, carbs: 48, fat: 10 },
      { name: 'Whole grain cereal with almond milk and fruit', calories: 310, protein: 14, carbs: 46, fat: 8 },
      { name: 'Scrambled tofu with vegetables', calories: 290, protein: 20, carbs: 28, fat: 12 },
      { name: 'Quinoa breakfast bowl with nuts and honey', calories: 350, protein: 14, carbs: 50, fat: 12 },
    ],
    lunch: [
      { name: 'Mediterranean salad with grilled chicken', calories: 420, protein: 36, carbs: 32, fat: 18 },
      { name: 'Quinoa bowl with roasted vegetables and tahini', calories: 450, protein: 16, carbs: 52, fat: 20 },
      { name: 'Salmon salad with avocado and mixed greens', calories: 480, protein: 38, carbs: 28, fat: 26 },
      { name: 'Buddha bowl with chickpeas and tahini dressing', calories: 460, protein: 18, carbs: 56, fat: 18 },
      { name: 'Tuna poke bowl with seaweed salad', calories: 440, protein: 36, carbs: 40, fat: 16 },
      { name: 'Chicken and avocado wrap with side salad', calories: 470, protein: 34, carbs: 42, fat: 20 },
      { name: 'Veggie-packed grain bowl with feta', calories: 490, protein: 20, carbs: 58, fat: 20 },
    ],
    dinner: [
      { name: 'Baked salmon with quinoa and roasted vegetables', calories: 520, protein: 40, carbs: 44, fat: 22 },
      { name: 'Stir-fried tofu with vegetables and brown rice', calories: 460, protein: 24, carbs: 58, fat: 16 },
      { name: 'Chicken breast with roasted sweet potato and greens', calories: 490, protein: 42, carbs: 48, fat: 14 },
      { name: 'Grilled fish tacos with cabbage slaw', calories: 450, protein: 36, carbs: 42, fat: 18 },
      { name: 'Vegetable curry with chickpeas and rice', calories: 480, protein: 18, carbs: 68, fat: 16 },
      { name: 'Turkey meatballs with zucchini noodles', calories: 420, protein: 38, carbs: 32, fat: 18 },
      { name: 'Lentil soup with whole grain bread', calories: 440, protein: 22, carbs: 60, fat: 12 },
    ],
    snacks: [
      { name: 'Hummus with vegetable sticks', calories: 150, protein: 6, carbs: 18, fat: 7 },
      { name: 'Almonds and dried cranberries', calories: 180, protein: 6, carbs: 20, fat: 10 },
      { name: 'Protein smoothie with berries', calories: 200, protein: 18, carbs: 24, fat: 4 },
      { name: 'Rice cakes with avocado', calories: 170, protein: 4, carbs: 22, fat: 8 },
      { name: 'Fruit salad with chia seeds', calories: 160, protein: 4, carbs: 30, fat: 4 },
    ],
  },
  'Core Strength': {
    breakfast: [
      { name: 'Protein omelet with vegetables and toast', calories: 400, protein: 28, carbs: 36, fat: 16 },
      { name: 'Protein oatmeal with nuts and banana', calories: 380, protein: 22, carbs: 52, fat: 12 },
      { name: 'Greek yogurt parfait with granola', calories: 360, protein: 24, carbs: 44, fat: 10 },
      { name: 'Egg white scramble with turkey sausage', calories: 340, protein: 32, carbs: 24, fat: 14 },
      { name: 'Protein smoothie bowl with toppings', calories: 390, protein: 26, carbs: 48, fat: 10 },
      { name: 'Whole grain waffles with protein yogurt', calories: 420, protein: 22, carbs: 54, fat: 12 },
      { name: 'Breakfast burrito with egg whites and beans', calories: 410, protein: 28, carbs: 46, fat: 14 },
    ],
    lunch: [
      { name: 'Grilled chicken with quinoa and vegetables', calories: 520, protein: 46, carbs: 48, fat: 14 },
      { name: 'Turkey and avocado wrap with fruit', calories: 480, protein: 38, carbs: 50, fat: 16 },
      { name: 'Salmon bowl with brown rice and edamame', calories: 560, protein: 44, carbs: 54, fat: 20 },
      { name: 'Chicken stir-fry with vegetables and rice', calories: 540, protein: 42, carbs: 58, fat: 14 },
      { name: 'Tuna salad with whole grain crackers', calories: 460, protein: 38, carbs: 42, fat: 18 },
      { name: 'Lean beef bowl with sweet potato', calories: 580, protein: 46, carbs: 52, fat: 20 },
      { name: 'Shrimp and quinoa power bowl', calories: 500, protein: 40, carbs: 56, fat: 14 },
    ],
    dinner: [
      { name: 'Grilled chicken breast with roasted vegetables', calories: 480, protein: 48, carbs: 36, fat: 16 },
      { name: 'Baked salmon with quinoa and asparagus', calories: 540, protein: 44, carbs: 48, fat: 20 },
      { name: 'Turkey meatballs with whole wheat pasta', calories: 560, protein: 46, carbs: 56, fat: 16 },
      { name: 'Lean steak with sweet potato and broccoli', calories: 580, protein: 50, carbs: 48, fat: 22 },
      { name: 'Grilled fish with wild rice and green beans', calories: 500, protein: 42, carbs: 52, fat: 14 },
      { name: 'Chicken fajita bowl with peppers and onions', calories: 520, protein: 46, carbs: 50, fat: 16 },
      { name: 'Pork tenderloin with Brussels sprouts and quinoa', calories: 560, protein: 48, carbs: 48, fat: 20 },
    ],
    snacks: [
      { name: 'Protein shake', calories: 220, protein: 25, carbs: 20, fat: 6 },
      { name: 'Greek yogurt with berries', calories: 180, protein: 18, carbs: 22, fat: 4 },
      { name: 'Hard-boiled eggs with almonds', calories: 210, protein: 16, carbs: 8, fat: 14 },
      { name: 'Protein bar', calories: 240, protein: 20, carbs: 26, fat: 8 },
      { name: 'Cottage cheese with pineapple', calories: 190, protein: 20, carbs: 24, fat: 2 },
    ],
  },
};

// Helper function to get day of week
function getDayOfWeek(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

// Helper function to select meal based on day
function selectMealForDay(mealArray, dayIndex) {
  return mealArray[dayIndex % mealArray.length];
}

// Helper function to generate diet plan for a specific date
function generateDietPlanForDate(date, fitnessGoal) {
  const dayIndex = date.getDate(); // Use day of month as seed for variety
  const goalDiet = dietDatabase[fitnessGoal];

  if (!goalDiet) {
    return null;
  }

  const breakfast = selectMealForDay(goalDiet.breakfast, dayIndex);
  const lunch = selectMealForDay(goalDiet.lunch, dayIndex + 1);
  const dinner = selectMealForDay(goalDiet.dinner, dayIndex + 2);

  // Select 2 snacks
  const snack1 = selectMealForDay(goalDiet.snacks, dayIndex);
  const snack2 = selectMealForDay(goalDiet.snacks, dayIndex + 3);

  const meals = {
    breakfast,
    lunch,
    dinner,
    snacks: [snack1, snack2]
  };

  const totalCalories = breakfast.calories + lunch.calories + dinner.calories +
    snack1.calories + snack2.calories;
  const totalProtein = breakfast.protein + lunch.protein + dinner.protein +
    snack1.protein + snack2.protein;
  const totalCarbs = breakfast.carbs + lunch.carbs + dinner.carbs +
    snack1.carbs + snack2.carbs;
  const totalFat = breakfast.fat + lunch.fat + dinner.fat +
    snack1.fat + snack2.fat;

  return {
    meals,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
  };
}

// @route   GET /api/diet/:userId
// @desc    Get diet plan for a specific date
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const { date } = req.query; // format: YYYY-MM-DD
    const requestDate = date ? new Date(date) : new Date();
    requestDate.setHours(0, 0, 0, 0);

    // Get user's fitness goal from progress
    let progress = await UserProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'User progress not found. Please complete onboarding.'
      });
    }

    const fitnessGoal = progress.fitnessGoal;

    // Try to find existing diet plan
    let dietPlan = await DietPlan.findOne({
      userId: req.params.userId,
      date: requestDate
    });

    // If diet plan doesn't exist, generate it
    if (!dietPlan) {
      const generatedPlan = generateDietPlanForDate(requestDate, fitnessGoal);

      if (!generatedPlan) {
        return res.status(400).json({
          success: false,
          message: 'Invalid fitness goal'
        });
      }

      dietPlan = await DietPlan.create({
        userId: req.params.userId,
        fitnessGoal,
        date: requestDate,
        dayOfWeek: getDayOfWeek(requestDate),
        ...generatedPlan
      });
    }

    res.json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    console.error('Get diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching diet plan'
    });
  }
});

// @route   GET /api/diet/:userId/range
// @desc    Get diet plans for a date range (week or month)
// @access  Private
router.get('/:userId/range', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Get user's fitness goal
    let progress = await UserProgress.findOne({ userId: req.params.userId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'User progress not found'
      });
    }

    const fitnessGoal = progress.fitnessGoal;

    // Generate diet plans for each day in range
    const dietPlans = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      let dietPlan = await DietPlan.findOne({
        userId: req.params.userId,
        date: new Date(currentDate)
      });

      if (!dietPlan) {
        const generatedPlan = generateDietPlanForDate(currentDate, fitnessGoal);

        if (generatedPlan) {
          dietPlan = await DietPlan.create({
            userId: req.params.userId,
            fitnessGoal,
            date: new Date(currentDate),
            dayOfWeek: getDayOfWeek(currentDate),
            ...generatedPlan
          });
        }
      }

      if (dietPlan) {
        dietPlans.push(dietPlan);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      data: dietPlans
    });
  } catch (error) {
    console.error('Get diet plan range error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching diet plans'
    });
  }
});

module.exports = router;
