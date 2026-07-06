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
    proxy: {
      '/api': { target, changeOrigin: true, secure: false },
    },
  },
});
