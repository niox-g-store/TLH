const Mongoose = require('mongoose');
const slugify = require('slugify'); // Import slugify
const { Schema } = Mongoose;

// Campaign Schema
const CampaignSchema = new Schema({
  heading: {
    type: String,
    default: null,
  },
  sub_heading: {
    type: String,
    default: null,
  },
  slug: {
    type: String,
    unique: true // Ensure slugs are unique
  },
  footer: {
    type: Boolean,
    default: true,
  },
  links: {
    type: Boolean,
    default: true,
  },
  imageKey: {
    type: String,
    default: null,
  },
  imageUrl: {
    type: String,
    default: null
  },
  sent: {
    type: Boolean,
    default: false,
  },
  best_selling_products: {
    type: Mongoose.Schema.Types.Mixed,
    default: [],
  },
  discounted_products: {
    type: Mongoose.Schema.Types.Mixed,
    default: [],
  },
  new_arrivals: {
    type: Mongoose.Schema.Types.Mixed,
    default: [],
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

// Middleware to generate slug before saving
CampaignSchema.pre('save', function (next) {
  if (this.heading) {
    this.slug = slugify(this.heading, {
      lower: true, // Convert to lowercase
      strict: true, // Remove special characters
      trim: true // Remove leading/trailing spaces
    });
  }
  next();
});

module.exports = Mongoose.model('Campaign', CampaignSchema);