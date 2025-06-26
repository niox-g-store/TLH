const mongoose = require('mongoose');
const slugify = require('slugify');
const EVENT_CATEGORIES = require('../utils/eventCategories');
const EVENT_STATUS = requrie('../utils/eventStatus');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  capacity: {
    type: Number,
    default: null
  },
  attendees: {
    type: Number,
    default: 0
  },
  registeredAttendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  unregisteredAttendees: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest"
  },
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
  imageUrl: {
    type: String
  },
  price: { type: Number, default: 0 },
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
  next();
});

module.exports = mongoose.model('Event', eventSchema);
