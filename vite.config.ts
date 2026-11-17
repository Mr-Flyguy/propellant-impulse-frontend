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
      },
      '/propellants': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
