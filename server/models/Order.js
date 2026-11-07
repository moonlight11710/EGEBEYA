const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  productId: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Product',
    default: null,
  },
  productTitle: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    enum: ['electronics', 'raw_materials'],
    default: 'electronics',
  },
  unitPriceSnapshot: {
    type: Number,
    default: null,
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
  customerTelegramOrWhatsapp: {
    type: String,
    default: '',
    trim: true,
  },
  deliveryAddressOrCity: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  selectedSpecsOrNotes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: [
      'pending_confirmation',
      'deposit_paid',
      'in_transit',
      'arrived',
      'delivered',
      'cancelled',
    ],
    default: 'pending_confirmation',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);

