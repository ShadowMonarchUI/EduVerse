import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['lucide-react'],
      output: {
        globals: {
          'lucide-react': 'LucideReact'
        }
      }
    }
  }
})