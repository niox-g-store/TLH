// models/Withdrawal.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Setting = require('./setting');

const withdrawalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  ticketQuantity: {
    type: Number,
    default: 1
  },
  order: {
    type: String,
    ref: 'Order',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  commission: {
    type: Number,
    required: true,
    default: 0
  },
  bankAccountNumber: {
    type: String,
  },
  bankName: {
    type: String,
  },
  bankAccountName: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
  canWithdrawDate: {
    type: Date,
    required: true,
  },
  canWithdraw: {
    type: Boolean,
    default: false,
  },
  stopped: {
    type: Boolean,
    default: false
  },
  reference: { type: String },
});

withdrawalSchema.pre('validate', async function (next) {
  try {
    const setting = await Setting.findOne();

    if (!setting) {
      throw new Error("System setting not found");
    }
    const now = new Date();
    let canWithdrawDate = now;

    if (setting.earningControl === 'fixed') {
      const todayIndex = now.getDay();
      const dayMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };

      const fixedIndexes = setting.fixedDays.map(day => dayMap[day]);
      fixedIndexes.sort((a, b) => a - b);

      let daysToAdd = null;
      for (let i = 0; i < fixedIndexes.length; i++) {
        const diff = fixedIndexes[i] - todayIndex;
        if (diff > 0) {
          daysToAdd = diff;
          break;
        }
      }

      // if none found in future, pick first of next week
      if (daysToAdd === null && fixedIndexes.length > 0) {
        daysToAdd = 7 - todayIndex + fixedIndexes[0];
      }

      if (daysToAdd !== null) {
        canWithdrawDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      }

    } else if (setting.earningControl === 'hours') {
      const hours = setting.hours || 24;
      canWithdrawDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
    }

    this.canWithdrawDate = canWithdrawDate;
    this.canWithdraw = false;

    next();
  } catch (err) {
    next(err);
  }
});


module.exports = mongoose.model('Withdrawal', withdrawalSchema);
