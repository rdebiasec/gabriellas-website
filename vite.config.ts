import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PERMANENT FIX: Base path configuration
// When custom domain is configured in GitHub Pages:
// - Custom domain serves from root (/)
// - GitHub URL automatically redirects to custom domain
// So we always build with root path when custom domain is intended
// 
// IMPORTANT: If you remove custom domain, you'll need to change this back to '/gabriellas-website/'
// But since GitHub redirects GitHub URL to custom domain anyway, root path works for both
export default defineConfig({
  plugins: [react()],
  // Always use root path - works for custom domain
  // GitHub URL will redirect to custom domain automatically
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
