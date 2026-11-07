import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
} from 'lucide-react';
import ParticleWave from './ParticleWave';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onExploreClick }) {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-[#fafafa] dark:bg-slate-950 text-slate-900 dark:text-white pt-8 sm:pt-14 pb-0 transition-colors duration-200 border-b border-slate-200 dark:border-slate-800">
      {/* 3D Generative Particle Wave Canvas (Matches User's Reference Screenshot) */}
      <ParticleWave />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl pt-4 pb-16 sm:pb-24 space-y-6">
          {/* Micro-badge (Matches "BACKED BY" top tag in reference screenshot) */}
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <span className="text-[11px] tracking-widest font-semibold text-slate-400 dark:text-slate-500">
              {t('hero.tag')}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
              <Globe className="w-3 h-3 text-slate-700 dark:text-slate-300" />
              <span>{t('hero.hubs')}</span>
            </div>
          </div>

          {/* Headline (Matches typography & hierarchy in reference screenshot) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.08] sm:leading-[1.05]">
            {t('hero.titleLine1')} <br className="hidden sm:inline" />
            <span className="text-slate-950 dark:text-white">{t('hero.titleLine2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Dual Action Buttons (Matches solid black pill + clean white secondary pill in screenshot) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              to="/custom-request"
              className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
            >
              <span>{t('hero.ctaCustom')}</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>

            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-900 dark:text-white font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>{t('hero.ctaCatalog')}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Metrics Bar (Matches the 4-column divider strip at bottom of reference screenshot) */}
        <div className="border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 py-6 sm:py-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="py-3 sm:py-0 sm:px-6 first:pl-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('hero.metric1Value')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {t('hero.metric1Label')}
            </div>
          </div>

          <div className="py-3 sm:py-0 sm:px-6">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('hero.metric2Value')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {t('hero.metric2Label')}
            </div>
          </div>

          <div className="py-3 sm:py-0 sm:px-6">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('hero.metric3Value')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {t('hero.metric3Label')}
            </div>
          </div>

          <div className="py-3 sm:py-0 sm:px-6 last:pr-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('hero.metric4Value')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {t('hero.metric4Label')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
