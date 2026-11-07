import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { api } from '../api/apiClient';
import { formatCurrency } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import WhatsAppTelegramHandoff from './WhatsAppTelegramHandoff';

export default function PreOrderModal({ product, isOpen, onClose }) {
  const { settings } = useSettings();
  const { t } = useLanguage();

  const isRawMaterial = product?.category === 'raw_materials';
  const moq =
    isRawMaterial && product?.materialSpecs?.minimumOrderQuantity
      ? Number(product.materialSpecs.minimumOrderQuantity)
      : 1;
  const unitType =
    isRawMaterial && product?.materialSpecs?.unitType
      ? product.materialSpecs.unitType
      : 'Units';

  const [quantity, setQuantity] = useState(moq);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSpecNote, setSelectedSpecNote] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerTelegramOrWhatsapp, setCustomerTelegramOrWhatsapp] = useState('');
  const [deliveryAddressOrCity, setDeliveryAddressOrCity] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  // Re-sync defaults when product changes
  useEffect(() => {
    if (product) {
      const initialMoq =
        product.category === 'raw_materials' &&
        product.materialSpecs?.minimumOrderQuantity
          ? Number(product.materialSpecs.minimumOrderQuantity)
          : 1;
      setQuantity(initialMoq);

      const colors =
        product.category === 'electronics'
          ? product.electronicsSpecs?.colorOptions || []
          : product.materialSpecs?.availableColors || [];
      setSelectedColor(colors.length > 0 ? colors[0] : '');
      setSelectedSpecNote('');
      setError('');
      setCreatedOrder(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleQuantityChange = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setQuantity('');
      return;
    }
    setQuantity(num);
    if (isRawMaterial && num < moq) {
      setError(`${t('modal.moqWarning')} ${moq} ${unitType}.`);
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalQty = Number(quantity);
    if (!finalQty || finalQty < 1) {
      setError('Please specify a valid quantity.');
      return;
    }

    if (isRawMaterial && finalQty < moq) {
      setError(
        `${t('modal.moqWarning')} ${moq} ${unitType}. Please increase quantity.`
      );
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddressOrCity.trim()) {
      setError('Please provide your name, phone number, and delivery city/address.');
      return;
    }

    // Build specs summary note
    const specsParts = [];
    if (selectedColor) specsParts.push(`Color: ${selectedColor}`);
    if (product.electronicsSpecs?.ram && product.electronicsSpecs?.storage) {
      specsParts.push(
        `Specs: ${product.electronicsSpecs.ram} / ${product.electronicsSpecs.storage}`
      );
    }
    if (selectedSpecNote.trim()) specsParts.push(selectedSpecNote.trim());
    if (orderNotes.trim()) specsParts.push(`Notes: ${orderNotes.trim()}`);

    const finalSpecsOrNotes = specsParts.join(' | ');

    setSubmitting(true);
    try {
      const payload = {
        productId: product._id || product.id,
        productTitle: product.title,
        productCategory: product.category,
        unitPriceSnapshot: product.price || null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerTelegramOrWhatsapp: customerTelegramOrWhatsapp.trim(),
        deliveryAddressOrCity: deliveryAddressOrCity.trim(),
        quantity: finalQty,
        selectedSpecsOrNotes: finalSpecsOrNotes,
      };

      const res = await api.createOrder(payload);
      if (res && res.data) {
        setCreatedOrder(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit pre-order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const colors =
    product.category === 'electronics'
      ? product.electronicsSpecs?.colorOptions || []
      : product.materialSpecs?.availableColors || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-colors duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fadeIn my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* If Order is created, show WhatsApp/Telegram Handoff */}
        {createdOrder ? (
          <WhatsAppTelegramHandoff
            type="order"
            data={createdOrder}
            onClose={onClose}
          />
        ) : (
          <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Header Product Snapshot */}
            <div className="flex items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <img
                src={product.images && product.images[0]}
                alt={product.title}
                className="w-20 h-20 sm:w-22 sm:h-22 object-cover rounded-2xl border border-slate-200 dark:border-slate-700 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {product.category === 'electronics' ? 'Electronics' : 'Raw Materials'}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-snug mt-1.5 line-clamp-2">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-base font-extrabold text-slate-950 dark:text-white">
                    {product.priceType === 'inquire'
                      ? t('card.inquirePrice')
                      : formatCurrency(product.price, product.currency || settings.currency)}
                  </span>
                  <span className="text-xs text-slate-400">|</span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{product.estimatedDeliveryDays || '7-14 Days'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Category-Specific Spec Selector: Color */}
              {colors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Select Color / Variant
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedColor === c
                            ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-slate-950 dark:border-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity (with MOQ enforcement) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {t('modal.quantity')} ({unitType})
                  </label>
                  {isRawMaterial && moq > 1 && (
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {t('modal.moqWarning')}: {moq} {unitType}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(Math.max(moq, (Number(quantity) || moq) - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-lg flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={moq}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="w-24 text-center font-bold text-base bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-2 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange((Number(quantity) || moq) + 1)}
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-lg flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {isRawMaterial ? unitType : 'Item(s)'}
                  </span>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('modal.nameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('modal.namePlaceholder')}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('modal.phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t('modal.phonePlaceholder')}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('modal.addressLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('modal.addressPlaceholder')}
                    value={deliveryAddressOrCity}
                    onChange={(e) => setDeliveryAddressOrCity(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('modal.messagingLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('modal.messagingPlaceholder')}
                    value={customerTelegramOrWhatsapp}
                    onChange={(e) => setCustomerTelegramOrWhatsapp(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Order Notes / Custom Specs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('modal.notesLabel')}
                </label>
                <textarea
                  rows="2"
                  placeholder={t('modal.notesPlaceholder')}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                ></textarea>
              </div>

              {/* Info Note (Monochrome Gray) */}
              <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5" />
                <span>
                  No payment required right now. Submitting this form secures your batch queue and generates your Reference Code for direct WhatsApp / Telegram confirmation with our import team.
                </span>
              </div>

              {/* Submit Button (Monochrome Black & White) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 disabled:opacity-50 font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>{t('modal.submitting')}</span>
                  ) : (
                    <>
                      <span>{t('modal.submitPreorder')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
