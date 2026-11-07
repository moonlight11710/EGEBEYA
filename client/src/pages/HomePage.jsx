import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Laptop,
  Layers,
  X,
  Package,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Cpu,
  Shirt,
  Sparkles,
} from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import PreOrderModal from '../components/PreOrderModal';
import { api } from '../api/apiClient';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalogRef = useRef(null);
  const howItWorksRef = useRef(null);
  const categoriesRef = useRef(null);
  const { t } = useLanguage();

  // Filters from URL or state
  const currentCategory = searchParams.get('category') || 'all';
  const currentAvailability = searchParams.get('availability') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search input local state for smooth typing
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Pre-Order Modal State
  const [selectedProductForPreOrder, setSelectedProductForPreOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getProducts({
        category: currentCategory,
        availability: currentAvailability,
        search: currentSearch,
        sort: currentSort,
      });
      if (res && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`${t('catalog.errorTitle')} ${t('catalog.errorCheck')}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentCategory, currentAvailability, currentSearch, currentSort]);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === 'all' || val === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const clearSearch = () => {
    setSearchInput('');
    updateFilters({ search: '' });
  };

  const resetAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handleOpenPreOrder = (product) => {
    setSelectedProductForPreOrder(product);
    setIsModalOpen(true);
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryCardClick = (category, searchKeyword = '') => {
    updateFilters({ category, search: searchKeyword });
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const categoriesList = [
    {
      id: 'laptops',
      title: t('categoriesSection.laptops'),
      desc: t('categoriesSection.laptopsDesc'),
      icon: Laptop,
      category: 'electronics',
      keyword: 'MacBook',
    },
    {
      id: 'smartphones',
      title: t('categoriesSection.smartphones'),
      desc: t('categoriesSection.smartphonesDesc'),
      icon: Smartphone,
      category: 'electronics',
      keyword: 'Phone',
    },
    {
      id: 'hardware',
      title: t('categoriesSection.hardware'),
      desc: t('categoriesSection.hardwareDesc'),
      icon: Cpu,
      category: 'electronics',
      keyword: '',
    },
    {
      id: 'cotton',
      title: t('categoriesSection.cotton'),
      desc: t('categoriesSection.cottonDesc'),
      icon: Layers,
      category: 'raw_materials',
      keyword: 'Cotton',
    },
    {
      id: 'denim',
      title: t('categoriesSection.denim'),
      desc: t('categoriesSection.denimDesc'),
      icon: Sparkles,
      category: 'raw_materials',
      keyword: 'Denim',
    },
    {
      id: 'blanks',
      title: t('categoriesSection.blanks'),
      desc: t('categoriesSection.blanksDesc'),
      icon: Shirt,
      category: 'raw_materials',
      keyword: 'Hoodie',
    },
  ];

  return (
    <div>
      {/* Hero Section with Generative Particle Wave & 4-Column Metrics Bar */}
      <Hero onExploreClick={scrollToHowItWorks} />

      {/* "How Import-on-Demand Works" Clean Architecture Strip */}
      <section ref={howItWorksRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
            {t('protocol.tag')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('protocol.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {t('protocol.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 block">
              {t('protocol.step1Num')}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('protocol.step1Title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('protocol.step1Desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 block">
              {t('protocol.step2Num')}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('protocol.step2Title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('protocol.step2Desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 block">
              {t('protocol.step3Num')}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('protocol.step3Title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('protocol.step3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* SOURCING CATEGORIES SECTION (Transferred from footer to landing page) */}
      <section ref={categoriesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
              {t('categoriesSection.tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('categoriesSection.title')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            {t('categoriesSection.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoriesList.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryCardClick(cat.category, cat.keyword)}
                className="group cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center text-xs font-semibold text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform">
                  <span>{t('categoriesSection.viewAll')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Catalog Main Section */}
      <section ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
              {t('catalog.tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('catalog.title')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            {t('catalog.subtitle')}
          </p>
        </div>

        {/* Category Switcher Tabs (Clean Black & White Monochrome) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <button
            onClick={() => updateFilters({ category: 'all' })}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentCategory === 'all'
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {t('catalog.allCategories')} ({products.length})
          </button>
          <button
            onClick={() => updateFilters({ category: 'electronics' })}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentCategory === 'electronics'
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>{t('catalog.electronicsTab')}</span>
          </button>
          <button
            onClick={() => updateFilters({ category: 'raw_materials' })}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentCategory === 'raw_materials'
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('catalog.materialsTab')}</span>
          </button>
        </div>

        {/* Search & Secondary Filters Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('catalog.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Availability Switcher (Monochrome) */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
              {t('catalog.stockLabel')}
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => updateFilters({ availability: 'all' })}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentAvailability === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('catalog.stockAll')}
              </button>
              <button
                onClick={() => updateFilters({ availability: 'in_stock' })}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentAvailability === 'in_stock'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckCircle className="w-3 h-3 text-slate-700 dark:text-slate-300" />
                <span>{t('catalog.stockInStock')}</span>
              </button>
              <button
                onClick={() => updateFilters({ availability: 'preorder' })}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentAvailability === 'preorder'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-3 h-3 text-slate-700 dark:text-slate-300" />
                <span>{t('catalog.stockPreorder')}</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={currentSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
              >
                <option value="newest">{t('catalog.sortNewest')}</option>
                <option value="price_asc">{t('catalog.sortPriceAsc')}</option>
                <option value="price_desc">{t('catalog.sortPriceDesc')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(currentCategory !== 'all' ||
          currentAvailability !== 'all' ||
          currentSearch) && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-slate-400">Active filters:</span>
            {currentCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {currentCategory === 'electronics' ? t('catalog.electronicsTab') : t('catalog.materialsTab')}
                <button
                  onClick={() => updateFilters({ category: 'all' })}
                  className="hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentAvailability !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {currentAvailability === 'in_stock' ? t('catalog.stockInStock') : t('catalog.stockPreorder')}
                <button
                  onClick={() => updateFilters({ availability: 'all' })}
                  className="hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                "{currentSearch}"
                <button onClick={clearSearch} className="hover:text-slate-900 dark:hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline ml-2"
            >
              {t('catalog.clearFilters')}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center text-red-700 dark:text-red-400 max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl text-xs font-bold"
            >
              {t('catalog.retry')}
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onQuickPreOrder={handleOpenPreOrder}
              />
            ))}
          </div>
        )}

        {/* Empty Search State */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {t('catalog.noItemsTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('catalog.noItemsDesc')}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                {t('catalog.clearFilters')}
              </button>
              <Link
                to="/custom-request"
                className="px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <span>{t('catalog.requestCustom')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Banner: Custom Request CTA (Soft Grayish Card, not pitch black) */}
        <div className="mt-16 bg-slate-100/90 dark:bg-slate-900/80 rounded-3xl p-8 sm:p-12 text-slate-900 dark:text-white relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
              <span>{t('sourcingBanner.badge')}</span>
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-950 dark:text-white">
              {t('sourcingBanner.title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('sourcingBanner.desc')}
            </p>
            <div className="pt-2">
              <Link
                to="/custom-request"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold text-sm shadow-xs transition-all"
              >
                <span>{t('sourcingBanner.cta')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Order Modal */}
      <PreOrderModal
        product={selectedProductForPreOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProductForPreOrder(null);
        }}
      />
    </div>
  );
}
