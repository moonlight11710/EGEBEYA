const {
  initialSettings,
  initialProducts,
  initialOrders,
  initialCustomRequests,
} = require('./seedData');

// Clone to avoid mutating original seed templates
let products = JSON.parse(JSON.stringify(initialProducts)).map((p) => ({
  ...p,
  createdAt: new Date(p.createdAt),
}));

let orders = JSON.parse(JSON.stringify(initialOrders)).map((o) => ({
  ...o,
  createdAt: new Date(o.createdAt),
}));

let customRequests = JSON.parse(JSON.stringify(initialCustomRequests)).map((r) => ({
  ...r,
  createdAt: new Date(r.createdAt),
}));

let settings = { ...initialSettings, updatedAt: new Date() };

let orderSeq = 1030;
let requestSeq = 5020;

const inMemoryStore = {
  // --- PRODUCTS ---
  async getProducts({ category, availability, search, sort } = {}) {
    let result = [...products];

    if (category && category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (availability && availability !== 'all') {
      result = result.filter((p) => p.availabilityStatus === availability);
    }

    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term)) ||
          (p.electronicsSpecs &&
            p.electronicsSpecs.brand &&
            p.electronicsSpecs.brand.toLowerCase().includes(term))
      );
    }

    if (sort) {
      if (sort === 'price_asc') {
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (sort === 'price_desc') {
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  },

  async getProductBySlugOrId(identifier) {
    return (
      products.find(
        (p) =>
          p.slug === identifier ||
          p._id === identifier ||
          p.id === identifier
      ) || null
    );
  },

  async createProduct(data) {
    const id = 'prod_' + Date.now();
    const newProduct = {
      ...data,
      id,
      _id: id,
      createdAt: new Date(),
    };
    products.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id, updateData) {
    const index = products.findIndex((p) => p._id === id || p.id === id);
    if (index === -1) return null;
    products[index] = {
      ...products[index],
      ...updateData,
      _id: products[index]._id,
      id: products[index].id,
      updatedAt: new Date(),
    };
    return products[index];
  },

  async deleteProduct(id) {
    const index = products.findIndex((p) => p._id === id || p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },

  // --- ORDERS ---
  async getOrders(filter = {}) {
    let result = [...orders];
    if (filter.status && filter.status !== 'all') {
      result = result.filter((o) => o.status === filter.status);
    }
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  },

  async getOrderByCode(orderCode) {
    if (!orderCode) return null;
    const cleanCode = orderCode.trim().toUpperCase();
    return (
      orders.find(
        (o) =>
          o.orderCode.toUpperCase() === cleanCode ||
          o._id === orderCode ||
          o.id === orderCode
      ) || null
    );
  },

  async createOrder(data) {
    orderSeq += 1;
    const orderCode = data.orderCode || `IMP-${orderSeq}`;
    const id = 'ord_' + Date.now();
    const newOrder = {
      ...data,
      id,
      _id: id,
      orderCode,
      status: data.status || 'pending_confirmation',
      createdAt: new Date(),
    };
    orders.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(id, status) {
    const order = orders.find((o) => o._id === id || o.id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date();
    return order;
  },

  // --- CUSTOM REQUESTS ---
  async getCustomRequests(filter = {}) {
    let result = [...customRequests];
    if (filter.status && filter.status !== 'all') {
      result = result.filter((r) => r.status === filter.status);
    }
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  },

  async getCustomRequestByCode(requestCode) {
    if (!requestCode) return null;
    const cleanCode = requestCode.trim().toUpperCase();
    return (
      customRequests.find(
        (r) =>
          r.requestCode.toUpperCase() === cleanCode ||
          r._id === requestCode ||
          r.id === requestCode
      ) || null
    );
  },

  async createCustomRequest(data) {
    requestSeq += 1;
    const requestCode = data.requestCode || `REQ-${requestSeq}`;
    const id = 'req_' + Date.now();
    const newRequest = {
      ...data,
      id,
      _id: id,
      requestCode,
      status: data.status || 'new',
      createdAt: new Date(),
    };
    customRequests.unshift(newRequest);
    return newRequest;
  },

  async updateCustomRequestStatus(id, status) {
    const req = customRequests.find((r) => r._id === id || r.id === id);
    if (!req) return null;
    req.status = status;
    req.updatedAt = new Date();
    return req;
  },

  // --- SETTINGS ---
  async getSettings() {
    return { ...settings };
  },

  async updateSettings(updateData) {
    settings = {
      ...settings,
      ...updateData,
      updatedAt: new Date(),
    };
    return { ...settings };
  },
};

module.exports = inMemoryStore;

