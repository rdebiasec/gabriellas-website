import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: When using a custom domain with GitHub Pages:
// - Custom domain serves from root (/)
// - GitHub URL redirects to custom domain automatically
// So we always build with root base path when custom domain is intended
// Use environment variable to control this
export default defineConfig({
  plugins: [react()],
  // Always use root path - GitHub Pages will handle redirects
  // When custom domain is configured, it serves from root
  // When GitHub URL is used, GitHub redirects to custom domain
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
