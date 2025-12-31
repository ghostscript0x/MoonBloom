const express = require('express');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Less restrictive rate limiting for user verification endpoint
const meLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20, // Allow more requests for user verification
  message: 'Too many verification requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerValidation, async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Forward to centralized error handler for consistent responses
    return next(error);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginValidation, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
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

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
  router.get('/me', meLimiter, protect, async (req, res) => {
   try {
     const user = await User.findById(req.user.id).select('-password');
     if (!user) {
       return res.status(404).json({ success: false, message: 'User not found' });
     }
     res.status(200).json({
       success: true,
       data: user,
     });
   } catch (error) {
     console.error('Auth me error:', error.message);
     res.status(500).json({ success: false, message: 'Server error' });
   }
 });

// @desc    Verify OTP and activate account
// @route   POST /api/auth/verify-otp
// @access  Private (requires temp token)
 router.post('/verify-otp', async (req, res) => {
   const { otp } = req.body;

   // Validate OTP format
   if (!otp || !/^\d{6}$/.test(otp)) {
     return res.status(400).json({ success: false, message: 'Invalid OTP format' });
   }

   // Get token from Authorization header
   const token = req.headers.authorization?.replace('Bearer ', '');
   if (!token) {
     return res.status(401).json({ success: false, message: 'No token provided' });
   }

   try {
     // Verify token and get user
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const user = await User.findById(decoded.id);

     if (!user) {
       return res.status(404).json({ success: false, message: 'User not found' });
     }

     // Hash the provided OTP for comparison
     const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

     // Check if OTP is valid and not expired
     if (user.otp !== hashedOTP || !user.otpExpire || user.otpExpire < Date.now()) {
       return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
     }

     // Clear OTP and mark as verified
     user.otp = undefined;
     user.otpExpire = undefined;
     await user.save();

     // Send welcome email
     try {
       const sendEmail = require('../utils/sendEmail');
       await sendEmail({
         email: user.email,
         subject: 'Welcome to Moon Bloom! 🌸',
         template: 'welcome',
         data: { name: user.name, email: user.email },
       });
     } catch (emailError) {
       console.error('Email sending failed:', emailError.message);
     }

     res.status(200).json({
       success: true,
       message: 'Account verified successfully',
       data: {
         id: user._id,
         name: user.name,
         email: user.email,
       },
     });
   } catch (error) {
     console.error('OTP verification error:', error.message);
     res.status(500).json({ success: false, message: 'Server error' });
   }
  });

// @desc    Forgot Password - Check if email exists and send reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  try {
    // Check if user exists (but don't reveal this information)
    const user = await User.findOne({ email });

    // Always return the same response to prevent email enumeration
    const response = {
      success: true,
      message: 'If your email is registered, you will receive a password reset code shortly.'
    };

    // If user exists, generate and send reset OTP
    if (user) {
      // Generate password reset OTP (different from registration OTP)
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

      await user.save();

      try {
        const sendEmail = require('../utils/sendEmail');
        await sendEmail({
          email: user.email,
          subject: 'Password Reset - Moon Bloom Tracker',
          template: 'password-reset',
          data: {
            name: user.name,
            resetToken: resetToken,
            resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
          },
        });
      } catch (emailError) {
        console.error('Password reset email failed:', emailError.message);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Reset Password with Token
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate input
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide token and new password' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }

  try {
    // Hash the provided token for comparison
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = newPassword; // Will be hashed by pre-save middleware
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Private (requires JWT or temp token)
router.post('/resend-otp', async (req, res) => {
  // Get token from Authorization header
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    let user;

    // Try to verify as JWT first (logged in user)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id);
    } catch (jwtError) {
      // If JWT fails, try as temp token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      } catch (tempError) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email asynchronously
    sendEmail({
      email: user.email,
      subject: 'Your Moon Bloom Verification Code',
      template: 'otp',
      data: { name: user.name, otp: otp },
    }).catch(emailError => {
      console.error('OTP email failed:', emailError.message);
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Resend OTP error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;