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
    required: function () {
      return !this.googleId;
    },
    lowercase: true,
    trim: true,
    default: null
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
  companyName: {
    type: String,
  },
  provider: {
    type: String,
    required: true,
    default: EMAIL_PROVIDER.Email
  },
  googleId: {
    type: String
  },
  twoFactor: {
    type: String
  },
  isTwoFactorActive: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: ROLES.Member,
    enum: [ROLES.Admin, ROLES.Member, ROLES.Organizer]
  },
  imageUrl: {
    type: String
  },

  contactEmail: { type: String },
  instagram: { type: String },
  tiktok: { type: String },
  facebook: { type: String },

  phoneNumber: { type:String },

  bio: { type: String },

  banned: { type: Boolean, default: false },

  hasUpdateProfile: { type: Boolean, default: false },

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically create a slug from the title before saving
UserSchema.pre('save', async function (next) {
  if (this.userName) {
    this.userName = this.userName.replace(/\s+/g, ''); // remove all spaces
  }
  if (!this.companyName && this.organizer) {
    const Organizer = mongoose.model('Organizer');
    const org = await Organizer.findById(this.organizer);
    if (org && org.companyName) {
      this.companyName = org.companyName;
    }
  }
  const profileFields = [
    this.imageUrl,
    this.contactEmail,
    this.instagram,
    this.tiktok,
    this.facebook,
    this.phoneNumber,
    this.bio
  ];

  // Set hasUpdateProfile to true if any profile field has value
  if (profileFields.some(field => field && field.trim() !== '')) {
    this.hasUpdateProfile = true;
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', UserSchema);
