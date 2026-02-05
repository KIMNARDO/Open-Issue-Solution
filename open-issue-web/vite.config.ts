import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      api: path.resolve(__dirname, './src/api'),
      components: path.resolve(__dirname, './src/components'),
      hooks: path.resolve(__dirname, './src/hooks'),
      pages: path.resolve(__dirname, './src/pages'),
      store: path.resolve(__dirname, './src/store'),
      utils: path.resolve(__dirname, './src/utils'),
      types: path.resolve(__dirname, './src/types'),
      constant: path.resolve(__dirname, './src/constant'),
      contexts: path.resolve(__dirname, './src/contexts'),
      layout: path.resolve(__dirname, './src/layout'),
      themes: path.resolve(__dirname, './src/themes'),
      assets: path.resolve(__dirname, './src/assets'),
      routes: path.resolve(__dirname, './src/routes'),
      config: path.resolve(__dirname, './src/config.ts'),
      dialogs: path.resolve(__dirname, './src/dialogs')
    }
  },
  server: {
    port: 3008,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
