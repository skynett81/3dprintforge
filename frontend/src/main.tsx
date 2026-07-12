import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { I18nProvider } from './i18n';
import { ToastProvider } from './toast';
import { initialTheme, applyTheme } from './theme';
import './styles.css';

// Set the theme before first paint to avoid a flash of the wrong palette.
applyTheme(initialTheme());

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider lang="en">
      <ToastProvider>
        <App />
      </ToastProvider>
    </I18nProvider>
  </React.StrictMode>,
);
