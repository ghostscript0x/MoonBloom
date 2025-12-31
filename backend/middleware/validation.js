const Joi = require('joi');

// Register validation middleware
const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

// Login validation middleware
const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

// Cycle validation
const cycleValidation = (data) => {
  const schema = Joi.object({
    date: Joi.date().required(),
    phase: Joi.string().valid('menstrual', 'follicular', 'ovulation', 'luteal').required(),
    flow: Joi.string().valid('light', 'medium', 'heavy'),
    symptoms: Joi.array().items(Joi.string()),
    mood: Joi.string().valid('happy', 'sad', 'anxious', 'energetic', 'tired', 'irritable'),
    notes: Joi.string(),
    // Enhanced health tracking
    painIntensity: Joi.number().min(0).max(10),
    energyLevel: Joi.number().min(1).max(10),
    sleepQuality: Joi.string().valid('excellent', 'good', 'fair', 'poor', 'terrible'),
    temperature: Joi.number(),
    waterIntake: Joi.number().min(0),
    exercise: Joi.string().valid('none', 'light', 'moderate', 'intense', 'yoga'),
    medications: Joi.array().items(Joi.string()),
    supplements: Joi.array().items(Joi.string()),
  });
  return schema.validate(data);
};

// Forgot password validation
const forgotPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
  });
  return schema.validate(data);
};

// Reset password validation
const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    otp: Joi.string().length(6).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  cycleValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};