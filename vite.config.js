import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Proxy disabled for production deployment
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://ebayclone.olga-orlova.me',
  //       changeOrigin: true,
  //       secure: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     }
  //   }
  // }
})
