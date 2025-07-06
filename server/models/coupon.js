const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  percentage: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    default: 0
  },
  event: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  ticket: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
  quantity: {
    type: Number,
    default: null
  },
  usedCount: {  // how many times the coupon have been used, used count = quantity set active to false
    type: Number,
    default: 0
  },
  userLimit: {  // max usage a user can use use the coupon
    type: Number,
    default: 1
  },
  active: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update `updatedAt` on save
couponSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
