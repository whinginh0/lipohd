import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 4000,
    strictPort: true,
    open: false,
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        certificado: resolve(__dirname, 'certificado/index.html')
      }
    }
  }
});
