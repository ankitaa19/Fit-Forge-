const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserProgress = require('../models/UserProgress');
const DietWeightLoss = require('../models/DietWeightLoss');
const DietMuscleGain = require('../models/DietMuscleGain');
const DietGeneralFitness = require('../models/DietGeneralFitness');
const DietEndurance = require('../models/DietEndurance');
const DietFlexibilityMobility = require('../models/DietFlexibilityMobility');
const DietCoreStrength = require('../models/DietCoreStrength');

// Map fitness goals to their corresponding models
const dietModelMap = {
  'Weight Loss': DietWeightLoss,
  'Muscle Gain': DietMuscleGain,
  'General Fitness': DietGeneralFitness,
  'Endurance': DietEndurance,
  'Flexibility & Mobility': DietFlexibilityMobility,
  'Core Strength': DietCoreStrength
};

// Get diet plan for a specific date (cyclical 31-day system)
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query; // Expected format: YYYY-MM-DD

    // Get user's current fitness goal
    const userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    const fitnessGoal = userProgress.fitnessGoal;

    // Get the appropriate diet model based on fitness goal
    const DietModel = dietModelMap[fitnessGoal];
    if (!DietModel) {
      return res.status(400).json({ message: `No diet plan available for goal: ${fitnessGoal}` });
    }

    // Extract day of month from date (or use today if no date provided)
    let dayOfMonth;
    if (date) {
      const dateObj = new Date(date);
      dayOfMonth = dateObj.getDate(); // Returns 1-31
    } else {
      dayOfMonth = new Date().getDate();
    }

    // Fetch the diet plan for this day number
    const dietPlan = await DietModel.findOne({ dayNumber: dayOfMonth });

    if (!dietPlan) {
      return res.status(404).json({ message: `No diet plan found for day ${dayOfMonth}` });
    }

    // Calculate daily totals
    const dailyTotals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };

    ['breakfast', 'midMorningSnack', 'lunch', 'eveningSnack', 'dinner'].forEach(meal => {
      if (dietPlan[meal]) {
        dailyTotals.calories += dietPlan[meal].calories || 0;
        dailyTotals.protein += dietPlan[meal].protein || 0;
        dailyTotals.carbs += dietPlan[meal].carbs || 0;
        dailyTotals.fat += dietPlan[meal].fat || 0;
      }
    });

    res.json({
      success: true,
      fitnessGoal,
      dayNumber: dayOfMonth,
      date: date || new Date().toISOString().split('T')[0],
      meals: {
        breakfast: dietPlan.breakfast,
        midMorningSnack: dietPlan.midMorningSnack,
        lunch: dietPlan.lunch,
        eveningSnack: dietPlan.eveningSnack,
        dinner: dietPlan.dinner
      },
      tips: {
        hydration: dietPlan.hydrationTip,
        nutrition: dietPlan.nutritionTip
      },
      dailyTotals
    });

  } catch (error) {
    console.error('Error fetching diet plan:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get diet plan for entire month (for calendar view)
router.get('/:userId/month/:year/:month', auth, async (req, res) => {
  try {
    const { userId, year, month } = req.params;

    // Get user's current fitness goal
    const userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    const fitnessGoal = userProgress.fitnessGoal;

    // Get the appropriate diet model based on fitness goal
    const DietModel = dietModelMap[fitnessGoal];
    if (!DietModel) {
      return res.status(400).json({ message: `No diet plan available for goal: ${fitnessGoal}` });
    }

    // Calculate days in the specified month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Fetch all diet plans for the days in this month
    const dietPlans = await DietModel.find({
      dayNumber: { $lte: daysInMonth }
    }).sort({ dayNumber: 1 });

    // Create array of diet summaries for each day
    const monthlyDietPlans = dietPlans.map(plan => {
      const dailyCalories =
        (plan.breakfast?.calories || 0) +
        (plan.midMorningSnack?.calories || 0) +
        (plan.lunch?.calories || 0) +
        (plan.eveningSnack?.calories || 0) +
        (plan.dinner?.calories || 0);

      return {
        dayNumber: plan.dayNumber,
        date: `${year}-${String(month).padStart(2, '0')}-${String(plan.dayNumber).padStart(2, '0')}`,
        breakfastName: plan.breakfast?.name || '',
        lunchName: plan.lunch?.name || '',
        dinnerName: plan.dinner?.name || '',
        dailyCalories
      };
    });

    res.json({
      success: true,
      fitnessGoal,
      year: parseInt(year),
      month: parseInt(month),
      daysInMonth,
      dietPlans: monthlyDietPlans
    });

  } catch (error) {
    console.error('Error fetching monthly diet plans:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
