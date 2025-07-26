const mongoose = require('mongoose');
const slugify = require('slugify');
const { EVENT_STATUS, EVENT_CATEGORIES } = require('../utils/constants');
const { DateTime } = require('luxon');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  coupons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  }],
  capacity: {
    type: Number,
    default: 0
  },
  attendees: {
    type: Number,
    default: 0
  },
  registeredAttendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  unregisteredAttendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest"
  }],
  category: {
    type: String,
    enum: Object.values(EVENT_CATEGORIES),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(EVENT_STATUS),
    default: 'Upcoming'
  },
  isActive: {
    type: Boolean
  },
  visibility: {
    type: Boolean,
    default: false
  },
  imageUrls: [{
    type: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically create a slug from the title before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = new Date();  // Automatically update `updatedAt` on save
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true, // remove special characters
    });
  }
  this.startDate = DateTime.fromISO(this.startDate, { zone: 'Africa/Lagos' }).toUTC().toJSDate();
  this.endDate = DateTime.fromISO(this.endDate, { zone: 'Africa/Lagos' }).toUTC().toJSDate();
  next();
});

module.exports = mongoose.model('Event', eventSchema);
