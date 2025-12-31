const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorName: {
    type: String,
    required: [true, 'Please add doctor name'],
  },
  specialty: {
    type: String,
    enum: ['gynecologist', 'primary-care', 'endocrinologist', 'nutritionist', 'therapist', 'other'],
    default: 'gynecologist',
  },
  clinicName: {
    type: String,
  },
  date: {
    type: Date,
    required: [true, 'Please add appointment date'],
  },
  time: {
    type: String,
    required: [true, 'Please add appointment time'],
  },
  duration: {
    type: Number, // in minutes
    default: 30,
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'check-up', 'procedure', 'emergency', 'other'],
    default: 'consultation',
  },
  notes: {
    type: String,
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String,
  },
  reminders: [{
    type: String,
    enum: ['1-hour', '1-day', '1-week'],
  }],
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
appointmentSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);