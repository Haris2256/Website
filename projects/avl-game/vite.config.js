import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 1. Use a relative base path instead of a hardcoded absolute path
  base: '/avl-game/docs/',
  plugins: [react()],
  
  // 2. Configure the build process for GitHub pages
  build: {
    outDir: 'docs',       // Automatically puts the final files in the 'docs' folder
    emptyOutDir: true,    // Clears out the old files in 'docs' before putting in the new ones
  }
})