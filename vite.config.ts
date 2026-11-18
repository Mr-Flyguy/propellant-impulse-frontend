import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Reverse proxy configuration for API and MinIO object storage
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        timeout: 2000,
        proxyTimeout: 2000,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            const httpRes = res as any;
            if (httpRes && !httpRes.headersSent && typeof httpRes.writeHead === 'function') {
              httpRes.writeHead(503, { 'Content-Type': 'application/json' });
              httpRes.end(JSON.stringify({ message: 'Backend service offline' }));
            }
          });
        },
      },
      '/propellants': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        secure: false,
        timeout: 2000,
        proxyTimeout: 2000,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            const httpRes = res as any;
            if (httpRes && !httpRes.headersSent && typeof httpRes.writeHead === 'function') {
              httpRes.writeHead(503, { 'Content-Type': 'application/json' });
              httpRes.end(JSON.stringify({ message: 'MinIO storage offline' }));
            }
          });
        },
      },
    },
  },
});
