const mongoose = require('mongoose');

// Organizer Schema
const OrganizerSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String
  },
  event: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  created: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Organizer', OrganizerSchema);
