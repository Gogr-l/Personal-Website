import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages project URL: https://dmarti3-coder.github.io/Personal-Website/
export default defineConfig({
  plugins: [react()],
  base: '/Personal-Website/',
})
