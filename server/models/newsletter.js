const mongoose = require('mongoose');

// Newsletter Schema
const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String
  },
  subscribed: {
    type: Boolean,
    default: true
  },
  updatedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);
