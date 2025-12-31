const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  phase: {
    type: String,
    enum: ['menstrual', 'follicular', 'ovulation', 'luteal'],
    required: true,
  },
  flow: {
    type: String,
    enum: ['light', 'medium', 'heavy'],
  },
  symptoms: [{
    type: String,
  }],
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'energetic', 'tired', 'irritable'],
  },
  notes: {
    type: String,
  },
  // Enhanced health tracking
  painIntensity: {
    type: Number,
    min: 0,
    max: 10,
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10,
  },
  sleepQuality: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'terrible'],
  },
  temperature: {
    type: Number, // Basal body temperature in Fahrenheit
  },
  waterIntake: {
    type: Number, // Number of glasses
    min: 0,
  },
  exercise: {
    type: String,
    enum: ['none', 'light', 'moderate', 'intense', 'yoga'],
  },
  medications: [{
    type: String,
  }],
  supplements: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cycle', cycleSchema);