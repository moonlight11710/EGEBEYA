const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'GlobalImport Hub',
    trim: true,
  },
  whatsappNumber: {
    type: String,
    default: '251911000000',
    trim: true,
  },
  telegramUsername: {
    type: String,
    default: 'globalimport_owner',
    trim: true,
  },
  currency: {
    type: String,
    default: 'ETB',
    trim: true,
  },
  supportEmail: {
    type: String,
    default: 'support@globalimport.com',
    trim: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

