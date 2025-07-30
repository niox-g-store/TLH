const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  user: {
    _id: {
      type: String,
      default: null
    },
    name: {
      type: String
    },
  },
  address: {
    street: {
      type: String
    },
    city: {
      type: String
    },
  },
  phoneNumber: {
    type: String
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    default: null
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    default: null
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
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
  },
  paymentMethod: {
    type: String
  },
  payStackReference: {
    type: String,
  },
  payStackId: {
    type: String,
  },
  paymentFees: {
    type: String,
  },
  
  status: {
    type: String,
    default: false,
  },
  productStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered'],
    default: null
  },
  billingEmail: {
    type: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
