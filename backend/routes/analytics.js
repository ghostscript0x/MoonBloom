const express = require('express');
const Cycle = require('../models/Cycle');
const { protect } = require('../middleware/auth');
const { generateInsights } = require('../services/aiService');

const router = express.Router();

// @desc    Get all analytics data
// @route   GET /api/analytics
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = req.user;
    const cycles = await Cycle.find({ user: user.id }).sort({ date: -1 }).limit(90);

    // Calculate fertility data
    const fertileWindowStart = 10;
    const fertileWindowEnd = 16;
    const ovulationDay = 14;

    const today = new Date();
    const daysSinceLastPeriod = user.lastPeriodStart
      ? Math.floor((today.getTime() - user.lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const currentCycleDay = (daysSinceLastPeriod % user.cycleLength) + 1;

    const isInFertileWindow = currentCycleDay >= fertileWindowStart && currentCycleDay <= fertileWindowEnd;
    const isOvulationDay = currentCycleDay === ovulationDay;

    // Pregnancy probability calculation
    const getPregnancyProbability = (day) => {
      if (day === ovulationDay) return 33;
      if (day === ovulationDay - 1 || day === ovulationDay + 1) return 25;
      if (day >= fertileWindowStart && day <= fertileWindowEnd) return 15;
      return 3;
    };

    const pregnancyProbability = getPregnancyProbability(currentCycleDay);

    // Basic insights
    const totalCycles = cycles.length;
    const avgCycleLength = totalCycles > 0 ? Math.round(cycles.reduce((acc, cycle) => acc + 28, 0) / totalCycles) : 28;

    res.status(200).json({
      success: true,
      data: {
        fertility: {
          currentCycleDay,
          isInFertileWindow,
          isOvulationDay,
          pregnancyProbability,
          fertileWindowStart,
          fertileWindowEnd,
          ovulationDay,
        },
        insights: {
          totalCycles,
          avgCycleLength,
          lastPeriod: cycles.length > 0 ? cycles[0].date : null,
        }
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get fertility insights
// @route   GET /api/analytics/fertility
// @access  Private
router.get('/fertility', protect, async (req, res) => {
  try {
    const user = req.user;
    const cycles = await Cycle.find({ user: user.id }).sort({ date: -1 }).limit(6); // Last 6 months

    // Calculate fertility data
    const fertileWindowStart = 10;
    const fertileWindowEnd = 16;
    const ovulationDay = 14;

    const today = new Date();
    const daysSinceLastPeriod = user.lastPeriodStart
      ? Math.floor((today.getTime() - user.lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const currentCycleDay = (daysSinceLastPeriod % user.cycleLength) + 1;

    const isInFertileWindow = currentCycleDay >= fertileWindowStart && currentCycleDay <= fertileWindowEnd;
    const isOvulationDay = currentCycleDay === ovulationDay;

    // Pregnancy probability calculation
    const getPregnancyProbability = (day) => {
      if (day === ovulationDay) return 33;
      if (day === ovulationDay - 1 || day === ovulationDay + 1) return 25;
      if (day >= fertileWindowStart && day <= fertileWindowEnd) return 15;
      return 3;
    };

    const pregnancyProbability = getPregnancyProbability(currentCycleDay);

    res.status(200).json({
      success: true,
      data: {
        currentCycleDay,
        isInFertileWindow,
        isOvulationDay,
        pregnancyProbability,
        fertileWindowStart,
        fertileWindowEnd,
        ovulationDay,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get insights and analytics
// @route   GET /api/analytics/insights
// @access  Private
router.get('/insights', protect, async (req, res) => {
  try {
    const cycles = await Cycle.find({ user: req.user.id }).sort({ date: -1 }).limit(90); // Last 3 months

    // Use AI to generate insights
    const aiInsights = await generateInsights(req.user, cycles);

    res.status(200).json({
      success: true,
      data: aiInsights,
    });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;