// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/sailweb/',  // ✅ This is required for Vercel subfolder hosting
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.ngrok-free.app', 'pi5.local'],
    watch: {
      ignored: [path.resolve(__dirname, 'public/charts/**')],
    },
  },
});
