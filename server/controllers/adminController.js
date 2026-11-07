const dataAccess = require('../data/dataAccess');
const { ADMIN_TOKEN } = require('../middleware/auth');

exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!password || password !== expectedPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator password.',
      });
    }

    res.json({
      success: true,
      message: 'Admin authentication successful.',
      token: ADMIN_TOKEN,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const products = await dataAccess.getProducts();
    const orders = await dataAccess.getOrders();
    const customRequests = await dataAccess.getCustomRequests();

    const pendingOrders = orders.filter((o) => o.status === 'pending_confirmation').length;
    const inTransitOrders = orders.filter((o) => o.status === 'in_transit').length;
    const newRequests = customRequests.filter((r) => r.status === 'new').length;

    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders,
        inTransitOrders,
        totalCustomRequests: customRequests.length,
        newCustomRequests: newRequests,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve stats',
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.category) {
      return res.status(400).json({
        success: false,
        message: 'Product title and category are required.',
      });
    }

    // Auto-generate slug if not provided
    if (!data.slug) {
      data.slug =
        data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') +
        '-' +
        Math.floor(100 + Math.random() * 900);
    }

    const created = await dataAccess.createProduct(data);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: created,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await dataAccess.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dataAccess.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or already deleted',
      });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const orders = await dataAccess.getOrders({ status });
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'pending_confirmation',
      'deposit_paid',
      'in_transit',
      'arrived',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await dataAccess.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

exports.getCustomRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const requests = await dataAccess.getCustomRequests({ status });
    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching custom requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve custom requests',
      error: error.message,
    });
  }
};

exports.updateCustomRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'quoted', 'accepted', 'closed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid request status. Allowed: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await dataAccess.updateCustomRequestStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Custom request not found',
      });
    }

    res.json({
      success: true,
      message: `Custom request status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating custom request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update custom request status',
      error: error.message,
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { storeName, whatsappNumber, telegramUsername, currency, supportEmail } =
      req.body;

    const updated = await dataAccess.updateSettings({
      storeName,
      whatsappNumber,
      telegramUsername,
      currency,
      supportEmail,
    });

    res.json({
      success: true,
      message: 'Store settings updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store settings',
      error: error.message,
    });
  }
};

