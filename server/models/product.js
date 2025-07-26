const mongoose = require('mongoose');
const slugify = require('slugify');

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
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);