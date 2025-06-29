const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }],
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  finalAmount: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  amountBeforeDiscount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    reuqired: true,
  },
  paymentMethod: {
    type: String
  },
  transactionId: {
    type: String
  },
  billingEmail: {
    type: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
