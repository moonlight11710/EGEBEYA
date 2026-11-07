import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product, onQuickPreOrder }) {
  const { settings } = useSettings();
  const { t } = useLanguage();

  const isElectronics = product.category === 'electronics';
  const isRawMaterials = product.category === 'raw_materials';

  const isPreorder = product.availabilityStatus === 'preorder';
  const isInStock = product.availabilityStatus === 'in_stock';

  // Format price display
  const renderPrice = () => {
    if (product.priceType === 'inquire') {
      return (
        <div>
          <span className="text-[11px] uppercase font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 inline-block">
            {t('card.inquirePrice')}
          </span>
        </div>
      );
    }

    if (product.priceType === 'starting_at') {
      return (
        <div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            {t('card.startingAt')}
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white">
            {formatCurrency(product.price, product.currency || settings.currency)}
          </span>
        </div>
      );
    }

    return (
      <div>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
          Price
        </span>
        <span className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white">
          {formatCurrency(product.price, product.currency || settings.currency)}
        </span>
      </div>
    );
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={
            product.images && product.images[0]
              ? product.images[0]
              : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'
          }
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges (Monochrome Black & White) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {isInStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs">
              <CheckCircle className="w-3 h-3" />
              <span>{t('card.inStock')}</span>
            </span>
          ) : isPreorder ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs backdrop-blur-xs">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{t('card.preorder')}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-600 text-white shadow-xs">
              <AlertCircle className="w-3 h-3" />
              <span>{t('card.outOfStock')}</span>
            </span>
          )}

          {/* Featured pill */}
          {product.featured && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
              <Sparkles className="w-3 h-3" />
              <span>Popular</span>
            </span>
          )}
        </div>

        {/* Category Badge (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xs text-white border border-slate-700/50">
            {isElectronics ? 'Electronics' : 'Textile / Material'}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Subcategory */}
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
            {product.subCategory || (isElectronics ? 'Computing & Mobile' : 'Fabrics & Bulk')}
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
            <h3 className="font-bold text-slate-950 dark:text-white text-base leading-snug line-clamp-2 mb-2">
              {product.title}
            </h3>
          </Link>

          {/* Category-Specific Badges & Specifications */}
          {isElectronics && product.electronicsSpecs && (
            <div className="my-2.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              {product.electronicsSpecs.condition && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 text-[11px]">
                  {product.electronicsSpecs.condition}
                </span>
              )}
              {product.electronicsSpecs.ram && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 text-[11px]">
                  {product.electronicsSpecs.ram}
                </span>
              )}
              {product.electronicsSpecs.storage && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 text-[11px]">
                  {product.electronicsSpecs.storage}
                </span>
              )}
            </div>
          )}

          {isRawMaterials && product.materialSpecs && (
            <div className="my-2.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              {product.materialSpecs.unitType && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 text-[11px]">
                  {t('card.perUnit')} {product.materialSpecs.unitType}
                </span>
              )}
              {product.materialSpecs.minimumOrderQuantity && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 text-[11px]">
                  {t('card.moq')} {product.materialSpecs.minimumOrderQuantity} {product.materialSpecs.unitType || 'Units'}
                </span>
              )}
              {product.materialSpecs.materialComposition && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium truncate max-w-full border border-slate-200 dark:border-slate-700 text-[11px]">
                  {product.materialSpecs.materialComposition}
                </span>
              )}
            </div>
          )}

          {/* Short description excerpt */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing and Action Buttons (Monochrome Black & White) */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="min-w-0">{renderPrice()}</div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onQuickPreOrder(product)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-xs transition-all active:scale-95"
            >
              {isPreorder ? t('card.preorderBtn') : t('card.orderNowBtn')}
            </button>
            <Link
              to={`/product/${product.slug}`}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="View Spec Sheet"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
