import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'fs'
import { resolve } from 'path'

// Check if CNAME file exists (indicates custom domain is configured)
// CNAME file can be in root or public folder
const hasCustomDomain = existsSync(resolve(__dirname, 'public/CNAME')) || 
                        existsSync(resolve(__dirname, 'CNAME'))

export default defineConfig({
  plugins: [react()],
  // Use root path for custom domain, repository path for GitHub Pages URL
  base: hasCustomDomain ? '/' : '/gabriellas-website/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
