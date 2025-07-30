const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Campaign Schema
const CampaignSchema = new Schema({
  title: {
    type: String,
    default: null,
  },
  content: {
    type: String,
    default: null,
  },
  imageUrls: [{ type: String }],
  sent: {
    type: Boolean,
    default: false,
  },
  sentTo: {
    type: Number,
    default: 0
  },
  sentDate: {
    type: Date
  },
  timeSent: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  shouldEmailContainUserName: {
    type: Boolean,
    default: false
  },
  linkName: {
    type: String,
    default: null
  },
  linkUrl: {
    type: String,
    default: null
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'Organizer',
    default: null
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  updatedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Campaign', CampaignSchema);