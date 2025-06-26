const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Boolean,
    default: false
  },
  discountPrice: {
    type: Number,
  },
  expireDate: {
    type: Date,
    required: true
  },
  qrCode: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
