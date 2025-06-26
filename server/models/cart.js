const mongoose = require('mongoose');

// Cart Item Schema
const CartItemSchema = new mongoose.Schema({
  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  },
  name: {
    type: String,
  },
  quantity: Number,
  finalAmount: {
    type: Number,
    default: 0
  },
  amountBeforeDiscount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
});

module.exports = mongoose.model('CartItem', CartItemSchema);

// Cart Schema
const CartSchema = new mongoose.Schema({
  tickets: [CartItemSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Cart', CartSchema);
