const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Organizer Schema
const OrganizerSchema = new Schema({
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
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Organizer', OrganizerSchema);
