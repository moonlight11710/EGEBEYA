import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ShoppingBag,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { api } from '../api/apiClient';
import { formatCurrency } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import PreOrderModal from '../components/PreOrderModal';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { t, isAmharic } = useLanguage();

  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.getProductBySlug(slug);
        if (res && res.data) {
          setProduct(res.data);
          setActiveImageIndex(0);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error || 'Unable to locate this item in our catalog.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-semibold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const isElectronics = product.category === 'electronics';
  const isRawMaterials = product.category === 'raw_materials';
  const isInStock = product.availabilityStatus === 'in_stock';

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Back */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to products</span>
        </button>

        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          SKU: {product.slug}
        </span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs">
            <img
              src={images[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {/* Badges Overlay (Monochrome) */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {isInStock ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>In Stock Locally</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pre-Order: {product.estimatedDeliveryDays || '7-14 Days'}</span>
                </span>
              )}
              {product.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Batch</span>
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-slate-950 dark:border-white ring-2 ring-slate-200 dark:ring-slate-800 scale-105'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Sourcing Guarantees Strip */}
          <div className="mt-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100 block">100% Authentic</span>
                <span className="text-slate-500 dark:text-slate-400">Procured from verified primary distributors.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Truck className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100 block">Tracked Freight</span>
                <span className="text-slate-500 dark:text-slate-400">Live air freight checkpoint notifications.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100 block">Escrow Deposit</span>
                <span className="text-slate-500 dark:text-slate-400">Refund guarantee if specifications mismatch.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details & Pre-Order Box Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category tag */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                {isElectronics ? 'Electronics & Hardware' : 'Raw Materials & Bulk Apparel'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {product.subCategory}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Price block */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                {product.priceType === 'starting_at'
                  ? 'Import Starting Rate'
                  : product.priceType === 'inquire'
                  ? 'Batch Pricing'
                  : 'Total Landed Price'}
              </span>

              <div className="flex items-baseline gap-3">
                {product.priceType === 'inquire' ? (
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    Contact for Current Batch Price
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-black text-slate-950 dark:text-white">
                      {formatCurrency(product.price, product.currency || settings.currency)}
                    </span>
                    {isRawMaterials && product.materialSpecs?.unitType && (
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        / {product.materialSpecs.unitType}
                      </span>
                    )}
                  </>
                )}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                * Includes international air freight handling and customs clearance at our Addis Ababa dispatch hub.
              </p>
            </div>

            {/* Description */}
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line pt-2">
              {product.description}
            </div>

            {/* Specifications Sheet Table */}
            <div className="pt-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                Technical Specifications & Sourcing Attributes
              </h3>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {/* Dynamic Electronics Specs */}
                {isElectronics && product.electronicsSpecs && (
                  <>
                    {product.electronicsSpecs.brand && (
                      <div className="grid grid-cols-3 p-3">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Brand</span>
                        <span className="col-span-2 font-medium text-slate-900 dark:text-white">
                          {product.electronicsSpecs.brand}
                        </span>
                      </div>
                    )}
                    {product.electronicsSpecs.condition && (
                      <div className="grid grid-cols-3 p-3">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Condition</span>
                        <span className="col-span-2 font-bold text-slate-900 dark:text-white">
                          {product.electronicsSpecs.condition}
                        </span>
                      </div>
                    )}
                    {product.electronicsSpecs.processor && (
                      <div className="grid grid-cols-3 p-3">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Processor / Chip</span>
                        <span className="col-span-2 font-medium text-slate-900 dark:text-white">
                          {product.electronicsSpecs.processor}
                        </span>
                      </div>
                    )}
                    {product.electronicsSpecs.ram && (
                      <div className="grid grid-cols-3 p-3">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Memory (RAM)</span>
                        <span className="col-span-2 font-medium text-slate-900 dark:text-white">
                          {product.electronicsSpecs.ram}
                        </span>
                      </div>
                    )}
                    {product.electronicsSpecs.storage && (
                      <div className="grid grid-cols-3 p-3">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Storage</span>
                        <span className="col-span-2 font-medium text-slate-900 dark:text-white">
                          {product.electronicsSpecs.storage}
                        </span>
                      </div>
                    )}
                    {product.electronicsSpecs.colorOptions?.length > 0 && (
                      <div className="grid grid-cols-3 p-3">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Available Colors</span>
                        <span className="col-span-2 font-medium text-slate-900 dark:text-white">
                          {product.electronicsSpecs.colorOptions.join(', ')}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Dynamic Raw Materials Specs */}
                {isRawMaterials && product.materialSpecs && (
                  <>
                    {product.materialSpecs.unitType && (
                      <div className="grid grid-cols-3 p-3">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Sales Unit</span>
                        <span className="col-span-2 font-bold text-slate-900 dark:text-white">
                          Sold per {product.materialSpecs.unitType}
                        </span>
                      </div>
                    )}
                    {product.materialSpecs.minimumOrderQuantity && (
                      <div className="grid grid-cols-3 p-3">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Minimum Order</span>
                        <span className="col-span-2 font-bold text-slate-900 dark:text-white">
                          {product.materialSpecs.minimumOrderQuantity} {product.materialSpecs.unitType || 'Units'}
                        </span>
                      </div>
                    )}
                    {product.materialSpecs.materialComposition && (
                      <div className="grid grid-cols-3 p-3">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Composition</span>
                        <span className="col-span-2 font-medium text-slate-900 dark:text-white">
                          {product.materialSpecs.materialComposition}
                        </span>
                      </div>
                    )}
                    {product.materialSpecs.availableColors?.length > 0 && (
                      <div className="grid grid-cols-3 p-3">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Available Shades</span>
                        <span className="col-span-2 font-medium text-slate-900 dark:text-white">
                          {product.materialSpecs.availableColors.join(', ')}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Estimated Lead Time */}
                <div className="grid grid-cols-3 p-3">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Estimated Lead Time</span>
                  <span className="col-span-2 font-bold text-slate-900 dark:text-white">
                    {product.estimatedDeliveryDays || '7-14 Days'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Order CTA Button (Monochrome Black & White) */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold text-base shadow-xs transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{product.availabilityStatus === 'preorder' ? (isAmharic ? 'ቅድመ-ትዕዛዝ አስቀምጥ' : 'Place Pre-Order & Lock Batch') : (isAmharic ? 'አሁን እዘዝ' : 'Order Now')}</span>
            </button>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              {isAmharic ? 'ትዕዛዙ እንደተጠናቀቀ ፈጣን የቴሌግራም እና ዋትስአፕ ማረጋገጫ ይሰጥዎታል።' : 'Instant Telegram & WhatsApp verification handoff provided immediately after submission.'}
            </p>
          </div>
        </div>
      </div>

      {/* Pre-Order Modal */}
      <PreOrderModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
