import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'fr' | 'en' | 'es' | 'de';
export type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';

interface Settings {
  theme: Theme;
  language: Language;
  dateFormat: DateFormat;
  notifications: {
    realTime: boolean;
    reports: boolean;
    email: boolean;
    mobile: boolean;
  };
  defaultWarehouse: string;
  defaultPeriod: string;
  expertMode: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  formatDate: (date: Date) => string;
  applyTheme: (theme: Theme) => void;
}

const defaultSettings: Settings = {
  theme: 'system',
  language: 'fr',
  dateFormat: 'dd/mm/yyyy',
  notifications: {
    realTime: true,
    reports: true,
    email: false,
    mobile: true,
  },
  defaultWarehouse: 'paris',
  defaultPeriod: '4-semaines',
  expertMode: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('logimind-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const { i18n } = useTranslation();

  // Sauvegarder les paramètres
  useEffect(() => {
    localStorage.setItem('logimind-settings', JSON.stringify(settings));
  }, [settings]);

  // Appliquer la langue
  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language, i18n]);

  // Appliquer le thème
  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Écouter les changements du thème système
  useEffect(() => {
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (settings.dateFormat) {
      case 'mm/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-mm-dd':
        return `${year}-${month}-${day}`;
      case 'dd/mm/yyyy':
      default:
        return `${day}/${month}/${year}`;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, formatDate, applyTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}