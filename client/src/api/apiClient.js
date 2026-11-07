const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') + '/api';

const getHeaders = (isAdmin = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (isAdmin) {
    const token = localStorage.getItem('admin_token');
    const password = localStorage.getItem('admin_password');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (password) {
      headers['x-admin-password'] = password;
    }
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // Public
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.availability && params.availability !== 'all') query.append('availability', params.availability);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/products${qs}`);
    return handleResponse(res);
  },

  async getProductBySlug(slug) {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    return handleResponse(res);
  },

  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(orderData),
    });
    return handleResponse(res);
  },

  async getOrderByCode(code) {
    const res = await fetch(`${API_BASE}/orders/${code}`);
    return handleResponse(res);
  },

  async createCustomRequest(requestData) {
    const res = await fetch(`${API_BASE}/custom-requests`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(requestData),
    });
    return handleResponse(res);
  },

  async trackCode(code) {
    const res = await fetch(`${API_BASE}/track/${encodeURIComponent(code)}`);
    return handleResponse(res);
  },

  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse(res);
  },

  // Admin
  async adminLogin(password) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return handleResponse(res);
  },

  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  async getAdminOrders(status = '') {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    const res = await fetch(`${API_BASE}/admin/orders${query}`, {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  async getAdminCustomRequests(status = '') {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    const res = await fetch(`${API_BASE}/admin/custom-requests${query}`, {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },

  async updateCustomRequestStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/custom-requests/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(settingsData),
    });
    return handleResponse(res);
  },
};

