'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { GlobalLoader } from '@/components/ui/GlobalLoader';

type ThemeMode = 'dark' | 'light';

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within Providers');
  }

  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('shieldos-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('shieldos-theme', theme);
  }, [theme]);

  return (
    <Provider store={store}>
      <ThemeContext.Provider
        value={{
          theme,
          toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
        }}
      >
        <ToastProvider>
          <GlobalLoader />
          {children}
        </ToastProvider>
      </ThemeContext.Provider>
    </Provider>
  );
}
