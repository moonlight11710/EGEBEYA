import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CustomRequestPage from './pages/CustomRequestPage';
import TrackPage from './pages/TrackPage';
import AdminPage from './pages/AdminPage';

function NotFoundPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-4">
      <span className="text-4xl font-black text-slate-300 dark:text-slate-700">404</span>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Page Not Found</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        The page you are looking for doesn't exist or has moved.
      </p>
      <a
        href="/"
        className="inline-block px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
      >
        Return to Storefront
      </a>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SettingsProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900 transition-colors duration-200">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/custom-request" element={<CustomRequestPage />} />
                  <Route path="/track" element={<TrackPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
