const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['electronics', 'raw_materials'],
    required: true,
  },
  subCategory: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  images: {
    type: [String],
    default: [],
  },
  priceType: {
    type: String,
    enum: ['fixed', 'starting_at', 'inquire'],
    default: 'fixed',
  },
  price: {
    type: Number,
    default: null,
  },
  currency: {
    type: String,
    default: 'ETB',
  },
  availabilityStatus: {
    type: String,
    enum: ['preorder', 'in_stock', 'out_of_stock'],
    default: 'preorder',
  },
  estimatedDeliveryDays: {
    type: String,
    default: '7-14 Days',
  },
  electronicsSpecs: {
    brand: { type: String, default: '' },
    condition: {
      type: String,
      enum: ['Brand New', 'Open Box', 'Refurbished', ''],
      default: 'Brand New',
    },
    processor: { type: String, default: '' },
    ram: { type: String, default: '' },
    storage: { type: String, default: '' },
    colorOptions: { type: [String], default: [] },
  },
  materialSpecs: {
    unitType: {
      type: String,
      enum: ['Meter', 'Yard', 'Roll', 'Kg', 'Bundle', 'Piece', ''],
      default: 'Meter',
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
    },
    materialComposition: { type: String, default: '' },
    availableColors: { type: [String], default: [] },
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);

