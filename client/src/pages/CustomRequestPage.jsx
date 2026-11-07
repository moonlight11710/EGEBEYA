import React, { useState } from 'react';
import {
  Sparkles,
  Laptop,
  Layers,
  AlertCircle,
  FileQuestion,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { api } from '../api/apiClient';
import { useLanguage } from '../context/LanguageContext';
import WhatsAppTelegramHandoff from '../components/WhatsAppTelegramHandoff';

export default function CustomRequestPage() {
  const { t } = useLanguage();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [category, setCategory] = useState('electronics');
  const [itemNameOrModel, setItemNameOrModel] = useState('');
  const [desiredSpecsAndQuantity, setDesiredSpecsAndQuantity] = useState('');
  const [targetBudget, setTargetBudget] = useState('');
  const [referenceLinkOrImage, setReferenceLinkOrImage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdRequest, setCreatedRequest] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !itemNameOrModel.trim() ||
      !desiredSpecsAndQuantity.trim()
    ) {
      setError(
        'Please complete all required fields: Your Name, Phone Number, Item Name/Model, and Desired Specs & Quantity.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        category,
        itemNameOrModel: itemNameOrModel.trim(),
        desiredSpecsAndQuantity: desiredSpecsAndQuantity.trim(),
        targetBudget: targetBudget.trim(),
        referenceLinkOrImage: referenceLinkOrImage.trim(),
      };

      const res = await api.createCustomRequest(payload);
      if (res && res.data) {
        setCreatedRequest(res.data);
      }
    } catch (err) {
      console.error('Error submitting custom request:', err);
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {createdRequest ? (
        <div className="max-w-xl mx-auto">
          <WhatsAppTelegramHandoff
            type="custom_request"
            data={createdRequest}
            onClose={() => setCreatedRequest(null)}
          />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              <span>Direct International Sourcing Desk</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              {t('customRequest.title')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('customRequest.subtitle')}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-10 transition-colors duration-200">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs sm:text-sm rounded-2xl flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category selector pills (Monochrome Black & White) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  1. {t('customRequest.categoryLabel')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCategory('electronics')}
                    className={`p-3.5 rounded-2xl text-xs font-bold border text-left flex items-center gap-3 transition-all ${
                      category === 'electronics'
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-slate-950 dark:border-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Laptop className="w-5 h-5 opacity-80" />
                    <div>
                      <span className="block font-bold">Electronics</span>
                      <span className={`text-[11px] font-normal ${category === 'electronics' ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>Laptops, Phones, Parts</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('raw_materials')}
                    className={`p-3.5 rounded-2xl text-xs font-bold border text-left flex items-center gap-3 transition-all ${
                      category === 'raw_materials'
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-slate-950 dark:border-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Layers className="w-5 h-5 opacity-80" />
                    <div>
                      <span className="block font-bold">Raw Materials</span>
                      <span className={`text-[11px] font-normal ${category === 'raw_materials' ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>Fabrics, Textiles, Blanks</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('other')}
                    className={`p-3.5 rounded-2xl text-xs font-bold border text-left flex items-center gap-3 transition-all ${
                      category === 'other'
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-slate-950 dark:border-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FileQuestion className="w-5 h-5 opacity-80" />
                    <div>
                      <span className="block font-bold">Special Import</span>
                      <span className={`text-[11px] font-normal ${category === 'other' ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>Tools, Machinery, Other</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Item Name / Model */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  2. {t('customRequest.itemNameLabel')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('customRequest.itemNamePlaceholder')}
                  value={itemNameOrModel}
                  onChange={(e) => setItemNameOrModel(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                />
              </div>

              {/* Desired Specs and Quantity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  3. {t('customRequest.specsLabel')}
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder={t('customRequest.specsPlaceholder')}
                  value={desiredSpecsAndQuantity}
                  onChange={(e) => setDesiredSpecsAndQuantity(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                ></textarea>
              </div>

              {/* Target Budget & Reference Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    4. {t('customRequest.budgetLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('customRequest.budgetPlaceholder')}
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    5. {t('customRequest.linkImageLabel')}
                  </label>
                  <input
                    type="url"
                    placeholder={t('customRequest.linkImagePlaceholder')}
                    value={referenceLinkOrImage}
                    onChange={(e) => setReferenceLinkOrImage(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                  6. Contact Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t('modal.nameLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t('modal.namePlaceholder')}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {t('modal.phoneLabel')}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={t('modal.phonePlaceholder')}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Guarantee badge */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5" />
                <p>
                  Zero upfront payment required to submit a custom sourcing request. You will receive a unique tracking reference code (`REQ-XXXX`) and one-click WhatsApp/Telegram confirmation to discuss current flight allocations and quotation.
                </p>
              </div>

              {/* Submit Button (Monochrome Black & White) */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 disabled:opacity-50 font-semibold text-sm sm:text-base shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Submitting Sourcing Request...</span>
                ) : (
                  <>
                    <span>{t('customRequest.submitBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
