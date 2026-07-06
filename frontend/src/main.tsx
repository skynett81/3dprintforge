import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { I18nProvider } from './i18n';
import { ToastProvider } from './toast';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider lang="en">
      <ToastProvider>
        <App />
      </ToastProvider>
    </I18nProvider>
  </React.StrictMode>,
);
