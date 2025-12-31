const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        // Add other profile fields as needed
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Update settings (these would be stored in a separate settings model in production)
    user.notificationsEnabled = req.body.notificationsEnabled ?? user.notificationsEnabled;
    user.appLockEnabled = req.body.appLockEnabled ?? user.appLockEnabled;
    user.cycleLength = req.body.cycleLength ?? user.cycleLength;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        notificationsEnabled: user.notificationsEnabled,
        appLockEnabled: user.appLockEnabled,
        cycleLength: user.cycleLength,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;