import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Globe,
  ShieldCheck,
  PlaneTakeoff,
  Clock,
  Phone,
  Send,
  Lock,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const location = useLocation();

  // Hide footer completely on admin routes (/admin)
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-zinc-200 dark:bg-zinc-900/95 text-zinc-700 dark:text-zinc-300 mt-16 border-t border-zinc-300 dark:border-zinc-800 transition-colors duration-200">
      {/* Trust & Guarantee Strip (Grayer, compact) */}
      <div className="border-b border-zinc-300 dark:border-zinc-800/80 bg-zinc-300/40 dark:bg-zinc-900/50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-zinc-950 dark:text-white font-bold text-xs tracking-tight">
                {t('footer.verified')}
              </h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {t('footer.verifiedDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 shadow-2xs">
              <PlaneTakeoff className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-zinc-950 dark:text-white font-bold text-xs tracking-tight">
                {t('footer.freight')}
              </h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {t('footer.freightDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl border border-zinc-300 dark:border-zinc-700 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-zinc-950 dark:text-white font-bold text-xs tracking-tight">
                {t('footer.escrow')}
              </h4>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {t('footer.escrowDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links - Compact 3-column layout without lengthy redundant categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span className="text-zinc-950 dark:text-white font-black text-sm tracking-tight">
                {settings.storeName || 'GlobalImport'}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              {t('footer.about')}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/${(settings.whatsappNumber || '251911000000').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white border border-zinc-300 dark:border-zinc-700 flex items-center justify-center transition-colors shadow-2xs"
                title="Chat on WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://t.me/${(settings.telegramUsername || 'globalimport_owner').replace(/^@/, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white border border-zinc-300 dark:border-zinc-700 flex items-center justify-center transition-colors shadow-2xs"
                title="Chat on Telegram"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Direct Sourcing Links */}
          <div>
            <h4 className="text-zinc-950 dark:text-white font-bold text-xs tracking-wider uppercase mb-3">
              {t('footer.directSourcing')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/custom-request"
                  className="text-zinc-950 dark:text-white font-semibold hover:underline"
                >
                  {t('footer.requestCustomLink')}
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  {t('footer.trackLink')}
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '251911000000').replace(/[^0-9]/g, '')}?text=Hello!%20I%20have%20an%20import%20pricing%20question.`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  {t('footer.forexLink')}
                </a>
              </li>
              <li>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {t('footer.hubLocation')}
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Contact & Admin */}
          <div>
            <h4 className="text-zinc-950 dark:text-white font-bold text-xs tracking-wider uppercase mb-3">
              {t('footer.ownerDesk')}
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
              {t('footer.ownerDeskDesc')}
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 font-mono text-zinc-800 dark:text-zinc-200">
                <span className="font-bold text-zinc-950 dark:text-white">WA:</span>
                <span>+{settings.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-zinc-800 dark:text-zinc-200">
                <span className="font-bold text-zinc-950 dark:text-white">TG:</span>
                <span>@{settings.telegramUsername}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-300 dark:border-zinc-800">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors font-medium"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t('footer.adminPortal')}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-5 border-t border-zinc-300 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-600 dark:text-zinc-400 gap-3">
          <p>© {new Date().getFullYear()} {settings.storeName || 'GlobalImport'}. {t('footer.rights')}</p>
          <div className="flex items-center space-x-6">
            <span>{t('footer.protocolLabel')}</span>
            <span>{t('footer.currencyLabel')} {settings.currency || 'ETB'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
