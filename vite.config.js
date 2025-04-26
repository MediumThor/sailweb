// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [path.resolve(__dirname, 'public/charts/**')],  // Prevent Vite from watching all the PNG files
    },
  },
});
