import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// base: './' → خروجی build روی هر مسیری (از جمله GitHub Pages) بدون تنظیم اضافه کار می‌کند
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5173, open: true },
  // پیش‌بهینه‌سازی وابستگی‌ها تا در اولین اجرا صفحه دوبار بارگذاری نشود
  optimizeDeps: { include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'recharts', 'three', '@react-three/fiber', '@react-three/drei', 'lucide-react', 'three/examples/jsm/loaders/STLLoader.js'] },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          charts: ['recharts'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
