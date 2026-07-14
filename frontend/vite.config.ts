/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: standalone server that proxies /api and /ws to a running 3DPrintForge
// (default plain HTTP port; override with VITE_API_TARGET).
// Build: emits into the real server's public/v2 so the existing static handler
// serves the React app at /v2 alongside the current UI — no backend change.
const target = process.env.VITE_API_TARGET || 'http://localhost:3000';

// Build stamp so a cached/stale bundle is obvious in the UI (helps diagnose
// service-worker / browser-cache issues — compare it to the latest build).
const BUILD_ID = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  base: command === 'build' ? '/v2/' : '/',
  build: {
    outDir: '../public/v2',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    host: true,
    proxy: {
      '/api': { target, changeOrigin: true, secure: false },
      '/ws': { target, changeOrigin: true, secure: false, ws: true },
      '/lang': { target, changeOrigin: true, secure: false },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
}));
