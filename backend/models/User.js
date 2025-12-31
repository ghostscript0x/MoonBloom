const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // User settings
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  appLockEnabled: {
    type: Boolean,
    default: false,
  },
  cycleLength: {
    type: Number,
    default: 28,
    min: 21,
    max: 45,
  },
   lastPeriodStart: {
     type: Date,
   },
   otp: String,
   otpExpire: Date,
});

// Hash password before saving
userSchema.pre('save', async function () {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return;

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // Throw so Mongoose will catch and forward to the error handler
    throw error;
  }
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required — ensure backend/.env is loaded or set process.env.JWT_SECRET');
  }

  return jwt.sign(
    {
      id: this._id,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
      issuer: 'moon-bloom-tracker',
      audience: 'moon-bloom-users'
    }
  );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate cryptographically secure OTP
userSchema.methods.generateOTP = function () {
  // Generate 6-digit OTP using crypto.randomInt for security
  const otp = crypto.randomInt(100000, 999999).toString();

  // Hash the OTP before storing for additional security
  this.otp = crypto.createHash('sha256').update(otp).digest('hex');
  this.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return otp; // Return the plain OTP for email
};

module.exports = mongoose.model('User', userSchema);