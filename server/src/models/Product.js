const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    regularPrice: {
      type: Number,
      required: [true, 'Regular price is required'],
      min: 0
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0
    },
    images: {
      type: [String],
      validate: [val => val.length > 0, 'At least one product image is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    fabric: {
      type: String,
      required: [true, 'Fabric type is required'],
      trim: true
    },
    blousePiece: {
      type: Boolean,
      default: true
    },
    colors: {
      type: [String],
      default: []
    },
    stock: {
      type: Number,
      default: 10,
      min: 0
    },
    inStock: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: true
    },
    careInstructions: {
      type: String,
      default: 'Dry clean recommended. Store in a cool, dry place wrapped in cotton muslin.'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
