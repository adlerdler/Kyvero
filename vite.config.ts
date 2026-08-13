import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Custom plugin to prevent Vite's dev client from forcing window.location.reload()
// when WebSocket drops or reconnects in container environments.
const disableViteAutoReload = (): Plugin => ({
  name: 'disable-vite-auto-reload',
  transform(code, id) {
    if (id.includes('@vite/client') || id.includes('vite/dist/client')) {
      return {
        code: code
          .replace(/location\.reload\(\)/g, '(() => {})()')
          .replace(/window\.location\.reload\(\)/g, '(() => {})()')
          .replace(/new WebSocket/g, '(() => ({ addEventListener: () => {}, send: () => {}, close: () => {} }))'),
        map: null,
      };
    }
  },
});

export default defineConfig(() => {
  return {
    plugins: [disableViteAutoReload(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: false,
    },
  };
});
