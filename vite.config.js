import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    proxy: {
      // Configurar proxy para comunicação com backend Java
      '/api': {
        target: 'http://localhost:8080/StudioMuda',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      // Configurar aliases para importação de arquivos
      '@': '/src'
    }
  },
  // Garantir que todas as rotas sejam redirecionadas para index.html
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV !== 'production'
  }
});
