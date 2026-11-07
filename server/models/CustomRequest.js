const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  requestCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['electronics', 'raw_materials', 'other'],
    default: 'electronics',
  },
  itemNameOrModel: {
    type: String,
    required: true,
    trim: true,
  },
  desiredSpecsAndQuantity: {
    type: String,
    required: true,
  },
  targetBudget: {
    type: String,
    default: '',
  },
  referenceLinkOrImage: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['new', 'quoted', 'accepted', 'closed'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.CustomRequest || mongoose.model('CustomRequest', customRequestSchema);

