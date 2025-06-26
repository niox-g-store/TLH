const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Cart Item Schema
const CartItemSchema = new Schema({
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

module.exports = Mongoose.model('CartItem', CartItemSchema);

// Cart Schema
const CartSchema = new Schema({
  tickets: [CartItemSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: Boolean,
    default: false,
  }
});

module.exports = Mongoose.model('Cart', CartSchema);
