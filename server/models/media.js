const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  mediaUrl: {
    type: String,
  },
  default: {
    type: Boolean,
    required: false
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update `updatedAt` on save
mediaSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Media', mediaSchema);
