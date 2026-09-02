import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Clean path alias for src imports: import Component from '@/components/...'
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
    host: true, // Listen on all local IP addresses for easy mobile device LAN testing
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true if debugging production builds
    rollupOptions: {
      output: {
        // Separate third-party vendor dependencies into distinct cached chunks
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'axios'],
          motion: ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
});
