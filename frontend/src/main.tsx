import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { I18nProvider } from './i18n';
import { ToastProvider } from './toast';
import { initialTheme, applyTheme } from './theme';
import { initVersionCheck } from './version-check';
import './styles.css';

// Set the theme before first paint to avoid a flash of the wrong palette.
applyTheme(initialTheme());

// Auto-reload the SPA when a newer build is deployed (hash-router tabs never
// reload on their own, which left users staring at a stale bundle).
initVersionCheck();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider lang="en">
      <ToastProvider>
        <App />
      </ToastProvider>
    </I18nProvider>
  </React.StrictMode>,
);
