import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Check,
  Send,
  Phone,
  PackageSearch,
  ExternalLink,
} from 'lucide-react';
import {
  buildWhatsAppLink,
  buildTelegramLink,
  buildPreOrderMessage,
  buildCustomRequestMessage,
} from '../utils/formatters';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

export default function WhatsAppTelegramHandoff({
  type = 'order', // 'order' or 'custom_request'
  data,
  onClose,
}) {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!data) return null;

  const isOrder = type === 'order';
  const referenceCode = isOrder ? data.orderCode : data.requestCode;

  const prefilledMessage = isOrder
    ? buildPreOrderMessage(data, settings)
    : buildCustomRequestMessage(data, settings);

  const whatsappUrl = buildWhatsAppLink(settings.whatsappNumber, prefilledMessage);
  const telegramUrl = buildTelegramLink(settings.telegramUsername, prefilledMessage);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(prefilledMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg mx-auto text-center space-y-6 animate-fadeIn transition-colors duration-200">
      {/* Success Badge (Monochrome) */}
      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white rounded-full flex items-center justify-center mx-auto shadow-xs border border-slate-200 dark:border-slate-700">
        <CheckCircle2 className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          {isOrder ? t('handoff.preorderLogged') : t('handoff.requestLogged')}
        </span>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('handoff.nextStepTitle')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {t('handoff.nextStepDesc')}
        </p>
      </div>

      {/* Reference Code Box */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            {t('handoff.refCodeLabel')}
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-wider">
            {referenceCode}
          </span>
        </div>
        <button
          onClick={handleCopyCode}
          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          {copiedCode ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{t('handoff.copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('handoff.copyCode')}</span>
            </>
          )}
        </button>
      </div>

      {/* Handoff Buttons */}
      <div className="space-y-3 pt-2">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3.5 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all transform active:scale-95 group"
        >
          <Phone className="w-4 h-4 fill-current" />
          <span>{t('handoff.confirmWhatsApp')}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
        </a>

        {/* Telegram Button */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-semibold text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all transform active:scale-95 group"
        >
          <Send className="w-4 h-4 fill-current" />
          <span>{t('handoff.confirmTelegram')} (@{(settings.telegramUsername || 'globalimport_owner').replace(/^@/, '')})</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Message preview snippet */}
      <div className="text-left bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 rounded-xl p-3 text-[11px] font-mono leading-relaxed relative">
        <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 font-bold">{t('handoff.previewTitle')}</span>
          <button
            onClick={handleCopyMessage}
            className="text-[10px] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1 font-semibold"
          >
            {copiedMessage ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copiedMessage ? t('handoff.copied') : t('handoff.copyMessage')}</span>
          </button>
        </div>
        <pre className="whitespace-pre-wrap max-h-24 overflow-y-auto text-slate-600 dark:text-slate-300">
          {prefilledMessage}
        </pre>
      </div>

      {/* Footer navigation */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <Link
          to={`/track?code=${referenceCode}`}
          onClick={() => {
            if (onClose) onClose();
          }}
          className="text-slate-900 dark:text-white font-semibold hover:underline flex items-center gap-1"
        >
          <PackageSearch className="w-4 h-4" />
          <span>{t('handoff.openTracker')}</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium py-1 px-3"
          >
            {t('handoff.continueBrowsing')}
          </button>
        )}
      </div>
    </div>
  );
}
