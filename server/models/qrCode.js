const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  bytes: {
    type: Buffer,
    required: true
  },
  code: {
    type: String,
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Optional: Update timestamp automatically
qrCodeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('QRCode', qrCodeSchema);

// Security tip: Avoid encoding raw DB IDs in QR codes; instead use signed tokens or hashes if security is a concern.
// Your qr code is secured and we don't save your qr code to our servers
