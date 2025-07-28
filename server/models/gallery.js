const mongoose = require('mongoose');
const slugify = require('slugify');
const generateCompactImage = require('../utils/generateCompactImage');
const path = require('path');

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

  compactImage: {
    type: String,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update `updatedAt` on save
gallerySchema.pre('save', async function (next) {
  this.updatedAt = new Date();
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  if (this.bannerUrl && (!this.compactImage || this.isModified('bannerUrl'))) {
    const sourcePath = path.join(process.cwd(), 'file_manager', this.bannerUrl);
    const compactFilename = `${this._id}-gallery.jpg`;
    const compactUrl = await generateCompactImage(sourcePath, compactFilename);
    if (compactUrl) this.compactImage = compactUrl;
  }

  next();
});


module.exports = mongoose.model('Gallery', gallerySchema);
