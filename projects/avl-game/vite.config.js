import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Website/projects/avl-game/',  // ← Include full path!
  plugins: [react()],
})