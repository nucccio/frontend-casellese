import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const repoName = '/frontend-casellese/'; 

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? repoName : '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
  port: 5175,
  strictPort: true,
  proxy: {
    '/api': {
      target: 'https://backend-casellese.onrender.com',
      changeOrigin: true,
      secure: true,
    },
  },
},
})