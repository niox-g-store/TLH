const mongoose = require('mongoose');

const { ROLES, EMAIL_PROVIDER } = require('../utils/constants');

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: () => {
      return this.provider !== 'email' ? false : true;
    }
  },
  userName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String
  },
  password: {
    type: String,
    default: null,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organizer',
    default: null
  },
  provider: {
    type: String,
    required: true,
    default: EMAIL_PROVIDER.Email
  },
  googleId: {
    type: String
  },
  role: {
    type: String,
    default: ROLES.Member,
    enum: [ROLES.Admin, ROLES.Member, ROLES.Organizer]
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically create a slug from the title before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', UserSchema);
