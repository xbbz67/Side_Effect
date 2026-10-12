import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 300,
      ignored: ['**/research/**', '**/artifacts/**', '**/test-results/**'],
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
    include: ['pixi.js', 'motion/react', 'react-dom/client'],
  },
  build: { rollupOptions: { output: { manualChunks: { pixi: ['pixi.js'] } } } },
  test: { include: ['src/**/*.test.ts'] },
} as Parameters<typeof defineConfig>[0]);
