import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PackageSearch,
  Search,
  AlertCircle,
  Clock,
  Phone,
  Send,
} from 'lucide-react';
import { api } from '../api/apiClient';
import { formatCurrency, buildWhatsAppLink, buildTelegramLink } from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import StatusTimeline from '../components/StatusTimeline';

export default function TrackPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCode = searchParams.get('code') || '';
  const { settings } = useSettings();
  const { t } = useLanguage();

  const [inputCode, setInputCode] = useState(urlCode);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleCodes = ['IMP-1024', 'IMP-1025', 'IMP-1026', 'REQ-5012', 'REQ-5013'];

  const performLookup = async (codeToSearch) => {
    if (!codeToSearch || !codeToSearch.trim()) {
      setError('Please enter a tracking reference code (e.g. IMP-1024 or REQ-5012).');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const res = await api.trackCode(codeToSearch.trim());
      if (res && res.success) {
        setTrackingData(res);
      } else {
        setError(res.message || t('tracker.notFoundDesc'));
      }
    } catch (err) {
      console.error('Track lookup error:', err);
      setError(
        err.message ||
          t('tracker.notFoundDesc')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlCode) {
      setInputCode(urlCode);
      performLookup(urlCode);
    }
  }, [urlCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setSearchParams({ code: inputCode.trim() });
      performLookup(inputCode.trim());
    }
  };

  const handleChipClick = (code) => {
    setInputCode(code);
    setSearchParams({ code });
    performLookup(code);
  };

  // WhatsApp & Telegram inquiry URLs
  const inquiryMessage = trackingData
    ? `Hello ${settings.storeName}! I am tracking my item #${trackingData.code} (${trackingData.title}). Could you provide the latest update on its dispatch status?`
    : `Hello! I would like to check the status of reference code #${inputCode}`;

  const whatsappUrl = buildWhatsAppLink(settings.whatsappNumber, inquiryMessage);
  const telegramUrl = buildTelegramLink(settings.telegramUsername, inquiryMessage);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-slate-200 dark:border-slate-700">
            <PackageSearch className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            {t('tracker.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('tracker.subtitle')}
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors duration-200">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('tracker.placeholder')}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 dark:focus:ring-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3.5 rounded-2xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 text-white dark:text-slate-950 font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {loading ? t('tracker.tracking') : t('tracker.trackBtn')}
            </button>
          </form>

          {/* Quick Test Chips */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {t('tracker.trySample')}
            </span>
            {sampleCodes.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleChipClick(c)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold transition-colors border border-slate-200/60 dark:border-slate-700"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs sm:text-sm rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">{t('tracker.notFoundTitle')}</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Tracking Result Card */}
        {trackingData && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-8 animate-fadeIn transition-colors duration-200">
            {/* Top Overview Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    {trackingData.type === 'order' ? 'Catalog Pre-Order' : 'Custom Sourcing Request'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    Code: #{trackingData.code}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {trackingData.title}
                </h2>
              </div>

              {/* Status Badge (Monochrome Black & White) */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Status: {trackingData.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </span>
              </div>
            </div>

            {/* Visual 5-Step Progress Bar */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                {t('tracker.statusTitle')}
              </h3>
              <StatusTimeline
                timeline={trackingData.timeline}
                isCancelled={trackingData.isCancelled}
                status={trackingData.status}
              />
            </div>

            {/* Order Attributes Snapshot */}
            <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="font-semibold text-slate-400 dark:text-slate-500 block mb-1">
                  {t('tracker.customerDetails')}
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {trackingData.customerName}
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-400 dark:text-slate-500 block mb-1">Phone / Messaging</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {trackingData.customerPhone}
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-400 dark:text-slate-500 block mb-1">Destination</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {trackingData.deliveryAddressOrCity || 'Addis Ababa Hub'}
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-400 dark:text-slate-500 block mb-1">Estimated Dispatch</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  7-14 Days Air Freight
                </span>
              </div>
            </div>

            {/* Specs / Notes if available */}
            {trackingData.specsOrNotes && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ordered Specifications / Notes:
                </span>
                <p className="text-slate-600 dark:text-slate-300 font-mono">
                  {trackingData.specsOrNotes}
                </p>
              </div>
            )}

            {/* Instant Handoff / Contact Support Action */}
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Questions regarding this milestone?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Directly contact our flight clearance desk on WhatsApp or Telegram with reference code #{trackingData.code}.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Desk</span>
                </a>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
