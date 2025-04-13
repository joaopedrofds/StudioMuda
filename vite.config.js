import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // Garante que todas as rotas sejam redirecionadas para index.html
  },
});
