import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // Un solo servidor para todo: esta PC y la red local usan el mismo, con cambios en vivo.
    host: true,
    open: true,
  },
})
