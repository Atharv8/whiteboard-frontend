import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',  // Socket.IO global fix
  },
  server: {
    proxy: {
      '/socket.io': 'http://localhost:3001'
    }
  }
});