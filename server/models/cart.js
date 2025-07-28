const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Setting = require('./setting');

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
  },
  expectedPayout: { type: Number, default: 0 }
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
  selectedSize: {
    type: String,
    default: null
  },
  selectedColor: {
    type: String,
    default: null
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
      island: Boolean,
      mainland: Boolean,
      deliveryFee: Number
    }
  },
  type: {
    type: String,
    default: 'product'
  }
});

// Cart Schema
const CartSchema = new Schema({
  tickets: [TicketItemSchema],
  products: [ProductItemSchema],
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
    default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
});

async function calculateExpectedRevenue(price, quantity) {
  const parsedPrice = parseFloat(price) || 0;

  const settings = await Setting.findOne();
  const commissionPercent = settings ? settings.commission : 0;

  const commission = (commissionPercent / 100) * parsedPrice;

  let paystackFee = 0;

  if (parsedPrice > 2500) {
    paystackFee = (1.5 / 100) * parsedPrice + 100;
  } else {
    paystackFee = (1.5 / 100) * parsedPrice
  }
  if (paystackFee > 2000) paystackFee = 2000;

  const revenue = (parsedPrice - commission - paystackFee) * quantity;
  return revenue;
}

// Calculate total before saving
CartSchema.pre('save', async function (next) {
  this.updatedAt = new Date();

  // Calculate tickets total and expectedPayout for each ticket
  let total = 0;
  if (this.tickets && this.tickets.length > 0) {
    for (const item of this.tickets) {
      let itemPrice;
      itemPrice = item.discount && item.discountPrice ? item.discountPrice : item.price;
      if (item?.coupon) { // here we have a coupon ticket applied
        if (item.couponPercentage > 0) { // percentage coupon
          itemPrice -= item.couponDiscount
        } else if (item.couponAmount > 0) {  // fixed coupon
          itemPrice -= item.couponAmount // here coupon amount is negative
        }
      }

      // Pass the effective price for the calculation
      item.expectedPayout = await calculateExpectedRevenue(itemPrice, item.quantity);
    }
  }

  // Calculate tickets total
  //let total = 0;
  if (this.tickets && this.tickets.length > 0) {
    total = this.tickets.reduce((sum, item) => {
      let itemPrice;
      itemPrice = item.discount && item.discountPrice ? item.discountPrice : item.price;
      return sum + (itemPrice * item.quantity);
    }, 0);
  }
  // Products total
  if (this.products && this.products.length > 0) {
    total += this.products.reduce((sum, product) => {
      const productTotal = product.finalPrice * product.quantity;
      const deliveryFee = product.needsDelivery && product.deliveryInfo?.address?.deliveryFee
        ? product.deliveryInfo.address.deliveryFee
        : 0;
      return sum + productTotal + deliveryFee;
    }, 0);
  }

  this.total = total;
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
