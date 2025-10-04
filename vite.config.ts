import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/database'],
          gemini: ['@google/generative-ai']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
})