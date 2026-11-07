import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Globe,
  Menu,
  X,
  PackageSearch,
  Lock,
  Sun,
  Moon,
  Languages,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { isDark, toggleTheme } = useTheme();
  const { isAmharic, toggleLanguage, t } = useLanguage();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      {/* Main navigation (Clean minimalist aesthetic matching screenshot) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo (Clean black badge + bold title) */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {settings.storeName || 'GlobalImport'}
            </div>
          </Link>

          {/* Desktop Center Links (Matching screenshot's clean centered style) */}
          <nav className="hidden lg:flex items-center space-x-7 font-medium text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <Link
              to="/"
              className={`transition-colors hover:text-slate-950 dark:hover:text-white ${
                isActive('/') && !location.search
                  ? 'text-slate-950 dark:text-white font-semibold'
                  : ''
              }`}
            >
              {t('nav.catalog')}
            </Link>
            <Link
              to="/?category=electronics"
              className={`transition-colors hover:text-slate-950 dark:hover:text-white ${
                location.search.includes('electronics')
                  ? 'text-slate-950 dark:text-white font-semibold'
                  : ''
              }`}
            >
              {t('nav.electronics')}
            </Link>
            <Link
              to="/?category=raw_materials"
              className={`transition-colors hover:text-slate-950 dark:hover:text-white ${
                location.search.includes('raw_materials')
                  ? 'text-slate-950 dark:text-white font-semibold'
                  : ''
              }`}
            >
              {t('nav.materials')}
            </Link>
            <Link
              to="/track"
              className={`flex items-center gap-1.5 transition-colors hover:text-slate-950 dark:hover:text-white ${
                isActive('/track')
                  ? 'text-slate-950 dark:text-white font-semibold'
                  : ''
              }`}
            >
              <PackageSearch className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{t('nav.track')}</span>
            </Link>
          </nav>

          {/* Right Action Button, Language Toggle & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Toggle (EN / አማ) */}
            <button
              onClick={toggleLanguage}
              aria-label="Switch Language / ቋንቋ ቀይር"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title={isAmharic ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{isAmharic ? 'English' : 'አማርኛ'}</span>
            </button>

            {/* Dark/Light Mode */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? t('nav.lightMode') : t('nav.darkMode')}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Admin Lock Shortcut */}
            <Link
              to="/admin"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t('nav.admin')}
            >
              <Lock className="w-4 h-4" />
            </Link>

            {/* Black Pill CTA Button (Exact match for "Join the waitlist" in reference screenshot) */}
            <Link
              to="/custom-request"
              className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold text-xs sm:text-sm shadow-xs transition-all"
            >
              {t('nav.customRequest')}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              aria-label="Switch Language"
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {isAmharic ? 'EN' : 'አማ'}
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
            <Link
              to="/admin"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
              title={t('nav.admin')}
            >
              <Lock className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('nav.catalog')}
          </Link>
          <Link
            to="/?category=electronics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('nav.electronics')}
          </Link>
          <Link
            to="/?category=raw_materials"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('nav.materials')}
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <PackageSearch className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>{t('nav.track')}</span>
          </Link>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/custom-request"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 py-2.5 rounded-xl font-bold text-center text-sm shadow-xs"
            >
              {t('nav.customRequest')}
            </Link>
          </div>
          <div className="pt-2">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('nav.admin')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
