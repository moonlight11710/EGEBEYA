import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  Sparkles,
  Settings as SettingsIcon,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Check,
  AlertCircle,
  ExternalLink,
  Laptop,
  Layers,
} from 'lucide-react';
import { api } from '../api/apiClient';
import { formatCurrency } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';

export default function AdminPage() {
  const { settings: globalSettings, refreshSettings } = useSettings();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'requests' | 'settings'

  // Data states
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [settingsForm, setSettingsForm] = useState({
    storeName: '',
    whatsappNumber: '',
    telegramUsername: '',
    currency: 'ETB',
    supportEmail: '',
  });

  const [loadingData, setLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Product Add / Edit Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    title: '',
    slug: '',
    category: 'electronics',
    subCategory: '',
    description: '',
    images: '',
    priceType: 'fixed',
    price: '',
    currency: 'ETB',
    availabilityStatus: 'preorder',
    estimatedDeliveryDays: '7-14 Days',
    featured: false,
    electronicsSpecs: {
      brand: '',
      condition: 'Brand New',
      processor: '',
      ram: '',
      storage: '',
      colorOptions: '',
    },
    materialSpecs: {
      unitType: 'Meter',
      minimumOrderQuantity: 1,
      materialComposition: '',
      availableColors: '',
    },
  });

  // Check existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch admin data whenever authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllAdminData();
    }
  }, [isAuthenticated]);

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [statsRes, prodRes, ordRes, reqRes, setRes] = await Promise.all([
        api.getAdminStats().catch((err) => {
          if (err.message && err.message.includes('401')) {
            handleLogout();
          }
          return null;
        }),
        api.getProducts().catch(() => null),
        api.getAdminOrders().catch(() => null),
        api.getAdminCustomRequests().catch(() => null),
        api.getSettings().catch(() => null),
      ]);

      if (statsRes && statsRes.data) setStats(statsRes.data);
      if (prodRes && prodRes.data) setProducts(prodRes.data);
      if (ordRes && ordRes.data) setOrders(ordRes.data);
      if (reqRes && reqRes.data) setCustomRequests(reqRes.data);
      if (setRes && setRes.data) {
        setSettingsForm({
          storeName: setRes.data.storeName || 'GlobalImport',
          whatsappNumber: setRes.data.whatsappNumber || '251911000000',
          telegramUsername: setRes.data.telegramUsername || 'globalimport_owner',
          currency: setRes.data.currency || 'ETB',
          supportEmail: setRes.data.supportEmail || 'support@globalimport.com',
        });
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await api.adminLogin(passwordInput);
      if (res && res.token) {
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_password', passwordInput);
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid password. Please try again.');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Verify server is running.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_password');
    setIsAuthenticated(false);
  };

  const showNotification = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3500);
  };

  // --- PRODUCT MANAGEMENT ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      title: '',
      slug: '',
      category: 'electronics',
      subCategory: 'Laptops',
      description: '',
      images: '',
      priceType: 'fixed',
      price: '',
      currency: settingsForm.currency || 'ETB',
      availabilityStatus: 'preorder',
      estimatedDeliveryDays: '7-14 Days',
      featured: false,
      electronicsSpecs: {
        brand: '',
        condition: 'Brand New',
        processor: '',
        ram: '',
        storage: '',
        colorOptions: '',
      },
      materialSpecs: {
        unitType: 'Meter',
        minimumOrderQuantity: 1,
        materialComposition: '',
        availableColors: '',
      },
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      title: prod.title || '',
      slug: prod.slug || '',
      category: prod.category || 'electronics',
      subCategory: prod.subCategory || '',
      description: prod.description || '',
      images: Array.isArray(prod.images) ? prod.images.join(', ') : '',
      priceType: prod.priceType || 'fixed',
      price: prod.price !== null && prod.price !== undefined ? prod.price : '',
      currency: prod.currency || settingsForm.currency || 'ETB',
      availabilityStatus: prod.availabilityStatus || 'preorder',
      estimatedDeliveryDays: prod.estimatedDeliveryDays || '7-14 Days',
      featured: prod.featured || false,
      electronicsSpecs: {
        brand: prod.electronicsSpecs?.brand || '',
        condition: prod.electronicsSpecs?.condition || 'Brand New',
        processor: prod.electronicsSpecs?.processor || '',
        ram: prod.electronicsSpecs?.ram || '',
        storage: prod.electronicsSpecs?.storage || '',
        colorOptions: Array.isArray(prod.electronicsSpecs?.colorOptions)
          ? prod.electronicsSpecs.colorOptions.join(', ')
          : '',
      },
      materialSpecs: {
        unitType: prod.materialSpecs?.unitType || 'Meter',
        minimumOrderQuantity: prod.materialSpecs?.minimumOrderQuantity || 1,
        materialComposition: prod.materialSpecs?.materialComposition || '',
        availableColors: Array.isArray(prod.materialSpecs?.availableColors)
          ? prod.materialSpecs.availableColors.join(', ')
          : '',
      },
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: productFormData.title,
        slug: productFormData.slug,
        category: productFormData.category,
        subCategory: productFormData.subCategory,
        description: productFormData.description,
        images: productFormData.images
          ? productFormData.images.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        priceType: productFormData.priceType,
        price: productFormData.priceType === 'inquire' || !productFormData.price
          ? null
          : Number(productFormData.price),
        currency: productFormData.currency || settingsForm.currency || 'ETB',
        availabilityStatus: productFormData.availabilityStatus,
        estimatedDeliveryDays: productFormData.estimatedDeliveryDays,
        featured: Boolean(productFormData.featured),
        electronicsSpecs: {
          brand: productFormData.electronicsSpecs.brand,
          condition: productFormData.electronicsSpecs.condition,
          processor: productFormData.electronicsSpecs.processor,
          ram: productFormData.electronicsSpecs.ram,
          storage: productFormData.electronicsSpecs.storage,
          colorOptions: productFormData.electronicsSpecs.colorOptions
            ? productFormData.electronicsSpecs.colorOptions
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        },
        materialSpecs: {
          unitType: productFormData.materialSpecs.unitType,
          minimumOrderQuantity: Number(productFormData.materialSpecs.minimumOrderQuantity) || 1,
          materialComposition: productFormData.materialSpecs.materialComposition,
          availableColors: productFormData.materialSpecs.availableColors
            ? productFormData.materialSpecs.availableColors
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        },
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id || editingProduct.id, payload);
        showNotification('Product updated successfully!');
      } else {
        await api.createProduct(payload);
        showNotification('New product added to catalog!');
      }

      setIsProductModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteProduct(id);
      showNotification(`Deleted "${title}"`);
      loadAllAdminData();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  // --- ORDER STATUS UPDATE ---
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showNotification(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
      loadAllAdminData();
    } catch (err) {
      alert('Failed to update order: ' + err.message);
    }
  };

  // --- CUSTOM REQUEST STATUS UPDATE ---
  const handleRequestStatusChange = async (requestId, newStatus) => {
    try {
      await api.updateCustomRequestStatus(requestId, newStatus);
      showNotification(`Custom request updated to ${newStatus}`);
      loadAllAdminData();
    } catch (err) {
      alert('Failed to update request: ' + err.message);
    }
  };

  // --- SETTINGS UPDATE ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(settingsForm);
      refreshSettings();
      showNotification('Store contact settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  // ==========================================
  // RENDER: LOGIN GATE
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-8 space-y-6 transition-colors duration-200">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center mx-auto shadow-xs font-bold">
            <Lock className="w-5 h-5" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
              Store Owner Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter administrative password to manage catalog batches and orders.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                placeholder="Default: admin123"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Local dev default password: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 text-white dark:text-slate-950 font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loggingIn ? 'Authenticating...' : 'Enter Admin Dashboard'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: AUTHENTICATED DASHBOARD
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors duration-200">
      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-fadeIn">
          <Check className="w-4 h-4 text-white" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            Admin Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1">
            {settingsForm.storeName} Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllAdminData}
            disabled={loadingData}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            {loadingData ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Monochrome) */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Products ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Pre-Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Custom Requests ({customRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* ==========================================
          TAB 1: OVERVIEW
      ========================================== */}
      {activeTab === 'overview' && (
        <div className="py-6 space-y-8 animate-fadeIn">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Total Products
              </span>
              <span className="text-3xl font-extrabold text-slate-950 dark:text-white mt-1 block">
                {stats?.totalProducts ?? products.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Electronics & Textiles
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Pending Pre-Orders
              </span>
              <span className="text-3xl font-extrabold text-slate-950 dark:text-white mt-1 block">
                {stats?.pendingOrders ??
                  orders.filter((o) => o.status === 'pending_confirmation').length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Awaiting confirmation
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Orders In Transit
              </span>
              <span className="text-3xl font-extrabold text-slate-950 dark:text-white mt-1 block">
                {stats?.inTransitOrders ??
                  orders.filter((o) => o.status === 'in_transit').length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Freight in progress
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Custom Inquiries
              </span>
              <span className="text-3xl font-extrabold text-slate-950 dark:text-white mt-1 block">
                {stats?.totalCustomRequests ?? customRequests.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Unlisted sourcing
              </span>
            </div>
          </div>

          {/* Quick Action Banner (Soft Grayish) */}
          <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 text-slate-950 dark:text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Ready to add a new import batch?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create new catalog entries with category-specific specs (RAM/Storage or Fabric Meters/MOQ).
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Recent Orders Snapshot */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Pre-Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-slate-950 dark:text-white font-semibold hover:underline"
              >
                View all ({orders.length}) →
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id || order.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        #{order.orderCode}
                      </span>
                      <span className="text-xs text-slate-400">|</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {order.customerName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xs sm:max-w-md">
                      {order.productTitle} (Qty: {order.quantity})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: PRODUCTS MANAGER
      ========================================== */}
      {activeTab === 'products' && (
        <div className="py-6 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Catalog Products</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage items, pricing modes, and category-specific hardware & fabric attributes.
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold text-xs flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod._id || prod.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.images && prod.images[0]}
                      alt={prod.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {prod.category}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">
                        {prod.title}
                      </h4>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 block">
                        {prod.priceType === 'inquire'
                          ? 'Price Inquire'
                          : formatCurrency(prod.price, prod.currency || settingsForm.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {prod.availabilityStatus}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {prod.priceType}
                    </span>
                    {prod.category === 'raw_materials' && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                        MOQ: {prod.materialSpecs?.minimumOrderQuantity || 1}{' '}
                        {prod.materialSpecs?.unitType || 'Unit'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <a
                    href={`/product/${prod.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod._id || prod.id, prod.title)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: PRE-ORDERS TAB
      ========================================== */}
      {activeTab === 'orders' && (
        <div className="py-6 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pre-Order Records</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update shipment statuses and initiate 1-tap WhatsApp or phone contact with buyers.
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((order) => {
              const waText = `Hello ${order.customerName}! Regarding your Pre-Order #${order.orderCode} (${order.productTitle}):`;
              const waLink = `https://wa.me/${(order.customerPhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`;

              return (
                <div
                  key={order._id || order.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                          #{order.orderCode}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          • {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {order.productTitle} (Qty: {order.quantity})
                      </h4>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleOrderStatusChange(order._id || order.id, e.target.value)
                        }
                        className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-950 dark:focus:ring-white"
                      >
                        <option value="pending_confirmation">Pending Confirmation</option>
                        <option value="deposit_paid">Deposit Paid</option>
                        <option value="in_transit">In Transit (Freight)</option>
                        <option value="arrived">Arrived (Local Hub)</option>
                        <option value="delivered">Delivered / Handed Over</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes & Address */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Delivery Address:</span>{' '}
                      {order.deliveryAddressOrCity}
                    </div>
                    {order.selectedSpecsOrNotes && (
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Specs / Notes:</span>{' '}
                        {order.selectedSpecsOrNotes}
                      </div>
                    )}
                    {order.customerTelegramOrWhatsapp && (
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Social Handle:</span>{' '}
                        {order.customerTelegramOrWhatsapp}
                      </div>
                    )}
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="flex items-center gap-3 pt-1">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call ({order.customerPhone})</span>
                    </a>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 fill-current" />
                      <span>Chat WhatsApp</span>
                    </a>
                    <a
                      href={`/track?code=${order.orderCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-950 dark:text-white hover:underline font-semibold ml-auto"
                    >
                      Public Tracker Link ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: CUSTOM SOURCING REQUESTS
      ========================================== */}
      {activeTab === 'requests' && (
        <div className="py-6 space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Custom Sourcing Requests</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inquiries for unlisted laptops, GPUs, custom hardware, or bulk textile rolls.
            </p>
          </div>

          <div className="space-y-4">
            {customRequests.map((req) => {
              const waText = `Hello ${req.customerName}! Regarding your Custom Import Request #${req.requestCode} for "${req.itemNameOrModel}":`;
              const waLink = `https://wa.me/${(req.customerPhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`;

              return (
                <div
                  key={req._id || req.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                          #{req.requestCode}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {req.customerName}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          • {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {req.itemNameOrModel}
                      </h4>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Status:</span>
                      <select
                        value={req.status}
                        onChange={(e) =>
                          handleRequestStatusChange(req._id || req.id, e.target.value)
                        }
                        className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-950 dark:focus:ring-white"
                      >
                        <option value="new">New Inbound</option>
                        <option value="quoted">Quoted to Customer</option>
                        <option value="accepted">Accepted / Deposit Paid</option>
                        <option value="closed">Closed / Fulfilled</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Specs & Qty:</span>{' '}
                      {req.desiredSpecsAndQuantity}
                    </div>
                    {req.targetBudget && (
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Target Budget:</span>{' '}
                        {req.targetBudget}
                      </div>
                    )}
                    {req.referenceLinkOrImage && (
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Reference:</span>{' '}
                        <a
                          href={req.referenceLinkOrImage}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-900 dark:text-white hover:underline break-all"
                        >
                          {req.referenceLinkOrImage}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <a
                      href={`tel:${req.customerPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call ({req.customerPhone})</span>
                    </a>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 fill-current" />
                      <span>Chat WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 5: SETTINGS TAB
      ========================================== */}
      {activeTab === 'settings' && (
        <div className="py-6 max-w-xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Store & Contact Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure where customers are redirected when they tap "Confirm on WhatsApp" or "Confirm on Telegram".
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Store Business Name
              </label>
              <input
                type="text"
                value={settingsForm.storeName}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Store WhatsApp Number (digits only with country code)
              </label>
              <input
                type="text"
                placeholder="251911000000"
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Store Telegram Username (without @)
              </label>
              <input
                type="text"
                placeholder="globalimport_owner"
                value={settingsForm.telegramUsername}
                onChange={(e) => setSettingsForm({ ...settingsForm, telegramUsername: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={settingsForm.currency}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settingsForm.supportEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs shadow-xs transition-all"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================
          MODAL: ADD / EDIT PRODUCT
      ========================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-colors duration-200">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {editingProduct ? 'Edit Product' : 'Add New Product to Catalog'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Select category to dynamically show either Electronics specs or Raw Materials attributes.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Category Picker (Monochrome) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProductFormData({ ...productFormData, category: 'electronics' })}
                  className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 ${
                    productFormData.category === 'electronics'
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-slate-950 dark:border-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Laptop className="w-4 h-4" />
                  <span>Electronics</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProductFormData({ ...productFormData, category: 'raw_materials' })}
                  className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 ${
                    productFormData.category === 'raw_materials'
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-slate-950 dark:border-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Clothing & Raw Materials</span>
                </button>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.title}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, title: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sub-Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Laptops, Smartphones, Fabrics & Textiles"
                    value={productFormData.subCategory}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, subCategory: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Price Mode & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Price Type
                  </label>
                  <select
                    value={productFormData.priceType}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, priceType: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none font-semibold"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="starting_at">Starting At</option>
                    <option value="inquire">Inquire for Price</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Price Amount ({productFormData.currency})
                  </label>
                  <input
                    type="number"
                    disabled={productFormData.priceType === 'inquire'}
                    placeholder={productFormData.priceType === 'inquire' ? 'N/A' : '150000'}
                    value={productFormData.price}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, price: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none disabled:opacity-40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Stock Availability
                  </label>
                  <select
                    value={productFormData.availabilityStatus}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        availabilityStatus: e.target.value,
                      })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none font-semibold"
                  >
                    <option value="preorder">Pre-Order Import</option>
                    <option value="in_stock">In Stock Locally</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Delivery Days & Image URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Delivery Days
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7-14 Days or Ready for Pickup"
                    value={productFormData.estimatedDeliveryDays}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        estimatedDeliveryDays: e.target.value,
                      })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Image URLs (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={productFormData.images}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, images: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product Description
                </label>
                <textarea
                  rows="2"
                  value={productFormData.description}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, description: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                ></textarea>
              </div>

              {/* DYNAMIC SPECS: ELECTRONICS (Monochrome Slate) */}
              {productFormData.category === 'electronics' && (
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                    Electronics Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        placeholder="Apple, Dell, Asus"
                        value={productFormData.electronicsSpecs.brand}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            electronicsSpecs: {
                              ...productFormData.electronicsSpecs,
                              brand: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Condition
                      </label>
                      <select
                        value={productFormData.electronicsSpecs.condition}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            electronicsSpecs: {
                              ...productFormData.electronicsSpecs,
                              condition: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 font-medium"
                      >
                        <option value="Brand New">Brand New</option>
                        <option value="Open Box">Open Box</option>
                        <option value="Refurbished">Refurbished</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Processor / CPU
                      </label>
                      <input
                        type="text"
                        placeholder="M3, i7-13650HX, A17 Pro"
                        value={productFormData.electronicsSpecs.processor}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            electronicsSpecs: {
                              ...productFormData.electronicsSpecs,
                              processor: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        RAM / Memory
                      </label>
                      <input
                        type="text"
                        placeholder="16GB Unified, 32GB DDR5"
                        value={productFormData.electronicsSpecs.ram}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            electronicsSpecs: {
                              ...productFormData.electronicsSpecs,
                              ram: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Storage
                      </label>
                      <input
                        type="text"
                        placeholder="512GB SSD, 1TB NVMe"
                        value={productFormData.electronicsSpecs.storage}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            electronicsSpecs: {
                              ...productFormData.electronicsSpecs,
                              storage: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Color Options (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Space Gray, Silver"
                        value={productFormData.electronicsSpecs.colorOptions}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            electronicsSpecs: {
                              ...productFormData.electronicsSpecs,
                              colorOptions: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC SPECS: RAW MATERIALS (Monochrome Slate) */}
              {productFormData.category === 'raw_materials' && (
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                    Raw Material Specifications & MOQ
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Unit Type
                      </label>
                      <select
                        value={productFormData.materialSpecs.unitType}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            materialSpecs: {
                              ...productFormData.materialSpecs,
                              unitType: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 font-medium"
                      >
                        <option value="Meter">Meter</option>
                        <option value="Yard">Yard</option>
                        <option value="Roll">Roll</option>
                        <option value="Kg">Kg</option>
                        <option value="Bundle">Bundle</option>
                        <option value="Piece">Piece</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Minimum Order Quantity (MOQ)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={productFormData.materialSpecs.minimumOrderQuantity}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            materialSpecs: {
                              ...productFormData.materialSpecs,
                              minimumOrderQuantity: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Material Composition
                      </label>
                      <input
                        type="text"
                        placeholder="100% Combed Turkish Cotton (220 GSM)"
                        value={productFormData.materialSpecs.materialComposition}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            materialSpecs: {
                              ...productFormData.materialSpecs,
                              materialComposition: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Available Colors (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Ivory White, Deep Indigo, Sage"
                        value={productFormData.materialSpecs.availableColors}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            materialSpecs: {
                              ...productFormData.materialSpecs,
                              availableColors: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={productFormData.featured}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, featured: e.target.checked })
                  }
                  className="w-4 h-4 text-slate-900 rounded focus:ring-slate-900"
                />
                <label htmlFor="featuredToggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Feature this item on homepage
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold text-xs shadow-xs transition-all"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
