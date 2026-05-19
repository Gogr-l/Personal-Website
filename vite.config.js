import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages project URL: https://dmarti3-coder.github.io/Personal-Website/
// Local dev uses '/' so http://localhost:5173/ works; production build keeps the Pages base path.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/Personal-Website/',
}))
