const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { forgotPasswordValidation, resetPasswordValidation } = require('../middleware/validation');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  // Validate input
  const { error } = forgotPasswordValidation(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP - Moon Bloom',
        template: 'passwordReset',
        data: { otp, name: user.name },
      });

      res.status(200).json({ success: true, message: 'OTP sent to your email' });
    } catch (err) {
      console.log(err);
      user.otp = undefined;
      user.otpExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Verify OTP and reset password
// @route   POST /api/auth/resetpassword
// @access  Public
router.post('/resetpassword', async (req, res) => {
  // Validate input
  const { error } = resetPasswordValidation(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const { email, otp, password } = req.body;

  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Set new password
    user.password = password;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;