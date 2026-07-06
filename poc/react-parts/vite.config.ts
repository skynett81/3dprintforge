import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The PoC dev server proxies /api to a running 3DPrintForge server so the
// React app talks to the real backend. Defaults to the plain HTTP port
// (no self-signed cert to accept). Override with VITE_API_TARGET, e.g.
//   VITE_API_TARGET=https://localhost:3443 npm run dev
const target = process.env.VITE_API_TARGET || 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    // Bind all interfaces so http://localhost, http://127.0.0.1 and the LAN
    // IP all work (default localhost-only can bind IPv6 [::1] only and then
    // refuse IPv4 127.0.0.1 connections).
    host: true,
    proxy: {
      '/api': { target, changeOrigin: true, secure: false },
    },
  },
});
