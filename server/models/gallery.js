const mongoose = require('mongoose');
const slugify = require('slugify');

const gallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
  views: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  media: [
    {
      mediaUrl: {
        type: String,
      },
      mediaType: {
        type: String,
        enum: ['image', 'video'],
      },
      blurhash: {
        type: String,
      },
    },
  ],
  bannerUrl: {
    type: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update `updatedAt` on save
gallerySchema.pre('save', function(next) {
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
