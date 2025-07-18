const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Ticket Item Schema
const TicketItemSchema = new Schema({
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  coupon: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  couponDiscount: {
    type: Number,
    default: 0
  },
  couponAmount: {
    type: Number,
    default: 0
  },
  couponPercentage: {
    type: Number,
    default: 0
  },
  eventName: {
    type: String,
    required: true
  },
  ticketType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  ticketQuantity: {
    type: Number,
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Boolean,
    default: false
  },
  discountAmount: {
    type: Number,
  },
  discountPrice: {
    type: Number
  },
  type: {
    type: String,
    default: 'ticket'
  }
});

// Product Item Schema
const ProductItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },
  productSlug: {
    type: String
  },
  quantity: {
    type: Number,
    default: 1
  },
  productQuantity: {
    type: Number,
  },
  price: {
    type: Number,
    required: true
  },
  finalPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Boolean,
    default: false
  },
  discountPrice: {
    type: Number,
    default: 0
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  needsDelivery: {
    type: Boolean,
    default: false
  },
  deliveryInfo: {
    name: String,
    email: String,
    phoneNumber: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String
    }
  },
  type: {
    type: String,
    default: 'product'
  }
});

// General Cart Item Schema (can be either ticket or product)
const CartItemSchema = new Schema({}, { discriminatorKey: 'type', _id: false });
// Cart Schema
const CartSchema = new Schema({
  items: [Schema.Types.Mixed], // Can contain both tickets and products
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: 'Guest',
    default: null
  },
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from now
  }
});

// Calculate total before saving
CartSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate total
  let total = 0;
  if (this.items && this.items.length > 0) {
    total = this.items.reduce((sum, item) => {
      let itemPrice;
      if (item.type === 'product') {
        itemPrice = item.finalPrice;
      } else {
        itemPrice = item.discount && item.discountPrice ? item.discountPrice : item.price;
      }
      return sum + (itemPrice * item.quantity);
    }, 0);
  }
  
  this.total = total;
  next();
});

module.exports = mongoose.model('Cart', CartSchema);