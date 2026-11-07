import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/apiClient';

const SettingsContext = createContext({
  settings: {
    storeName: 'GlobalImport Hub',
    whatsappNumber: '251911000000',
    telegramUsername: 'globalimport_owner',
    currency: 'ETB',
    supportEmail: 'support@globalimport.com',
  },
  loading: true,
  refreshSettings: () => {},
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    storeName: 'GlobalImport Hub',
    whatsappNumber: '251911000000',
    telegramUsername: 'globalimport_owner',
    currency: 'ETB',
    supportEmail: 'support@globalimport.com',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.warn('Using default store settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

