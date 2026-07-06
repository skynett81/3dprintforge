import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The PoC dev server proxies /api to a running 3DPrintForge server so the
// React app talks to the real backend. Override the target with
// VITE_API_TARGET (default: the local HTTPS port with a self-signed cert).
const target = process.env.VITE_API_TARGET || 'https://localhost:3443';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': { target, changeOrigin: true, secure: false },
    },
  },
});
