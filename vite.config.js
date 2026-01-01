import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Google Identity Services uses window.postMessage from a cross-origin popup.
      // COOP: same-origin will block that. Relax to unsafe-none in dev.
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      // Do NOT set Cross-Origin-Embedder-Policy in dev; leave it unset.
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
