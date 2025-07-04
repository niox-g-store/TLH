const mongoose = require('mongoose');
const slugify = require('slugify');

const gallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
  },
  slug: {
    type: String,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  },
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update `updatedAt` on save
eventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true, // remove special characters
    });
  }
  next();
});

module.exports = mongoose.model('Gallery', gallerySchema);
