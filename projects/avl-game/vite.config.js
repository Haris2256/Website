import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/avl-game/',  // ← Add this line
  plugins: [react()],
})