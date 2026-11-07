const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const CustomRequest = require('../models/CustomRequest');
const Settings = require('../models/Settings');
const {
  initialSettings,
  initialProducts,
  initialOrders,
  initialCustomRequests,
} = require('../data/seedData');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log(
      '⚡ [DATA LAYER] No MONGODB_URI detected in .env. Running in Zero-Crash In-Memory mode with seeded data.'
    );
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ [DATA LAYER] Connected to MongoDB database successfully.');

    // Seed database if empty
    await seedMongoIfEmpty();

    return true;
  } catch (error) {
    console.warn(
      `⚠️ [DATA LAYER] Failed to connect to MongoDB (${error.message}). Falling back to Zero-Crash In-Memory store.`
    );
    isConnected = false;
    return false;
  }
};

const seedMongoIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 [SEED] Seeding MongoDB with initial products...');
      const cleanedProducts = initialProducts.map(({ id, _id, ...rest }) => rest);
      await Product.insertMany(cleanedProducts);
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('🌱 [SEED] Seeding MongoDB with initial orders...');
      const cleanedOrders = initialOrders.map(({ id, _id, ...rest }) => rest);
      await Order.insertMany(cleanedOrders);
    }

    const reqCount = await CustomRequest.countDocuments();
    if (reqCount === 0) {
      console.log('🌱 [SEED] Seeding MongoDB with initial custom requests...');
      const cleanedReqs = initialCustomRequests.map(({ id, _id, ...rest }) => rest);
      await CustomRequest.insertMany(cleanedReqs);
    }

    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      console.log('🌱 [SEED] Initializing MongoDB store settings...');
      const { id, ...restSettings } = initialSettings;
      await Settings.create(restSettings);
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err.message);
  }
};

const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getIsConnected,
};

