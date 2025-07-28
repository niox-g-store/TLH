const mongoose = require('mongoose');
const slugify = require('slugify');
const generateCompactImage = require('../utils/generateCompactImage');
const path = require('path');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  sku: {
    type: String,
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  imageUrls: [{
    type: String
  }],
  compactImage: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  SizeQuantity: [{
    size: {
      type: String
    },
    quantity: {
      type: Number,
      default: 0
    }
  }],
  colorAndImage: [{
    color: {
      type: String,
    },
    imageUrl: [{
      type: String,
    }]
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Automatically create a slug from the name before saving
productSchema.pre('save', async function (next) {
  this.updatedAt = new Date();

  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  const firstImage = this.imageUrls?.[0] || this.colorAndImage?.[0]?.imageUrl?.[0];

  if (firstImage && (!this.compactImage || this.isModified('imageUrls') || this.isModified('colorAndImage'))) {
    const sourcePath = path.join(process.cwd(), 'file_manager', firstImage);
    const compactFilename = `${this._id}-product.jpg`;
    const compactUrl = await generateCompactImage(sourcePath, compactFilename);
    if (compactUrl) this.compactImage = compactUrl;
  }

  next();
});


module.exports = mongoose.model('Product', productSchema);