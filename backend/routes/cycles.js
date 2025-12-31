const express = require('express');
const Cycle = require('../models/Cycle');
const { protect } = require('../middleware/auth');
const { cycleValidation } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all cycles for user
// @route   GET /api/cycles
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const cycles = await Cycle.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: cycles.length,
      data: cycles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get single cycle
// @route   GET /api/cycles/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Cycle not found' });
    }

    // Make sure user owns cycle
    if (cycle.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: cycle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create new cycle
// @route   POST /api/cycles
// @access  Private
router.post('/', protect, async (req, res) => {
  // Validate input
  const { error } = cycleValidation(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  req.body.user = req.user.id;

  try {
    const cycle = await Cycle.create(req.body);
    res.status(201).json({
      success: true,
      data: cycle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update cycle
// @route   PUT /api/cycles/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let cycle = await Cycle.findById(req.params.id);
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Cycle not found' });
    }

    // Make sure user owns cycle
    if (cycle.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    cycle = await Cycle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: cycle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete cycle
// @route   DELETE /api/cycles/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Cycle not found' });
    }

    // Make sure user owns cycle
    if (cycle.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await cycle.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;