const Mongoose = require('mongoose');

const { ROLES, EMAIL_PROVIDER } = require('../utils/constants');

const { Schema } = Mongoose;

// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: () => {
      return this.provider !== 'email' ? false : true;
    }
  },
  userName: {
    type: String
  },
  name: {
    type: String
  },
  password: {
    type: String,
    default: null,
  },
  organizer: {
    type: Schema.Types.ObjectId,
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
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('User', UserSchema);
