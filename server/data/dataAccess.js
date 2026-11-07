const Product = require('../models/Product');
const Order = require('../models/Order');
const CustomRequest = require('../models/CustomRequest');
const Settings = require('../models/Settings');
const inMemoryStore = require('./inMemoryStore');
const { getIsConnected } = require('../config/db');

// Helper to generate unique order and request reference codes
const generateUniqueOrderCode = async () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `IMP-${randomNum}`;
};

const generateUniqueRequestCode = async () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `REQ-${randomNum}`;
};

const dataAccess = {
  // PRODUCTS
  async getProducts(params = {}) {
    if (getIsConnected()) {
      const query = {};
      if (params.category && params.category !== 'all') {
        query.category = params.category;
      }
      if (params.availability && params.availability !== 'all') {
        query.availabilityStatus = params.availability;
      }
      if (params.search && params.search.trim()) {
        const regex = new RegExp(params.search.trim(), 'i');
        query.$or = [
          { title: regex },
          { subCategory: regex },
          { description: regex },
          { 'electronicsSpecs.brand': regex },
        ];
      }

      let queryBuilder = Product.find(query);
      if (params.sort === 'price_asc') {
        queryBuilder = queryBuilder.sort({ price: 1 });
      } else if (params.sort === 'price_desc') {
        queryBuilder = queryBuilder.sort({ price: -1 });
      } else {
        queryBuilder = queryBuilder.sort({ createdAt: -1 });
      }

      return await queryBuilder.lean();
    }
    return await inMemoryStore.getProducts(params);
  },

  async getProductBySlugOrId(identifier) {
    if (getIsConnected()) {
      let product = null;
      if (identifier && identifier.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(identifier).lean();
      }
      if (!product) {
        product = await Product.findOne({ slug: identifier }).lean();
      }
      return product;
    }
    return await inMemoryStore.getProductBySlugOrId(identifier);
  },

  async createProduct(data) {
    if (getIsConnected()) {
      const created = await Product.create(data);
      return created.toObject();
    }
    return await inMemoryStore.createProduct(data);
  },

  async updateProduct(id, updateData) {
    if (getIsConnected()) {
      let query = { _id: id };
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        query = { slug: id };
      }
      const updated = await Product.findOneAndUpdate(query, updateData, {
        new: true,
        runValidators: true,
      }).lean();
      return updated;
    }
    return await inMemoryStore.updateProduct(id, updateData);
  },

  async deleteProduct(id) {
    if (getIsConnected()) {
      let query = { _id: id };
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        query = { slug: id };
      }
      const deleted = await Product.findOneAndDelete(query);
      return !!deleted;
    }
    return await inMemoryStore.deleteProduct(id);
  },

  // ORDERS
  async getOrders(filter = {}) {
    if (getIsConnected()) {
      const query = {};
      if (filter.status && filter.status !== 'all') {
        query.status = filter.status;
      }
      return await Order.find(query).sort({ createdAt: -1 }).lean();
    }
    return await inMemoryStore.getOrders(filter);
  },

  async getOrderByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    if (getIsConnected()) {
      let order = await Order.findOne({ orderCode: cleanCode }).lean();
      if (!order && code.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(code).lean();
      }
      return order;
    }
    return await inMemoryStore.getOrderByCode(cleanCode);
  },

  async createOrder(data) {
    const orderCode = data.orderCode || (await generateUniqueOrderCode());
    const payload = {
      ...data,
      orderCode,
      status: data.status || 'pending_confirmation',
    };

    if (getIsConnected()) {
      const created = await Order.create(payload);
      return created.toObject();
    }
    return await inMemoryStore.createOrder(payload);
  },

  async updateOrderStatus(id, status) {
    if (getIsConnected()) {
      let query = { _id: id };
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        query = { orderCode: id };
      }
      const updated = await Order.findOneAndUpdate(
        query,
        { status },
        { new: true }
      ).lean();
      return updated;
    }
    return await inMemoryStore.updateOrderStatus(id, status);
  },

  // CUSTOM REQUESTS
  async getCustomRequests(filter = {}) {
    if (getIsConnected()) {
      const query = {};
      if (filter.status && filter.status !== 'all') {
        query.status = filter.status;
      }
      return await CustomRequest.find(query).sort({ createdAt: -1 }).lean();
    }
    return await inMemoryStore.getCustomRequests(filter);
  },

  async getCustomRequestByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    if (getIsConnected()) {
      let req = await CustomRequest.findOne({ requestCode: cleanCode }).lean();
      if (!req && code.match(/^[0-9a-fA-F]{24}$/)) {
        req = await CustomRequest.findById(code).lean();
      }
      return req;
    }
    return await inMemoryStore.getCustomRequestByCode(cleanCode);
  },

  async createCustomRequest(data) {
    const requestCode = data.requestCode || (await generateUniqueRequestCode());
    const payload = {
      ...data,
      requestCode,
      status: data.status || 'new',
    };

    if (getIsConnected()) {
      const created = await CustomRequest.create(payload);
      return created.toObject();
    }
    return await inMemoryStore.createCustomRequest(payload);
  },

  async updateCustomRequestStatus(id, status) {
    if (getIsConnected()) {
      let query = { _id: id };
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        query = { requestCode: id };
      }
      const updated = await CustomRequest.findOneAndUpdate(
        query,
        { status },
        { new: true }
      ).lean();
      return updated;
    }
    return await inMemoryStore.updateCustomRequestStatus(id, status);
  },

  // SETTINGS
  async getSettings() {
    if (getIsConnected()) {
      let settings = await Settings.findOne().lean();
      if (!settings) {
        settings = await Settings.create({});
      }
      return settings;
    }
    return await inMemoryStore.getSettings();
  },

  async updateSettings(updateData) {
    if (getIsConnected()) {
      let settings = await Settings.findOneAndUpdate(
        {},
        { ...updateData, updatedAt: new Date() },
        { new: true, upsert: true }
      ).lean();
      return settings;
    }
    return await inMemoryStore.updateSettings(updateData);
  },
};

module.exports = dataAccess;
