// vite.config.js
import { defineConfig } from 'vite'

const devServer = "http://localhost:3001"

export default defineConfig({
  server: {
    proxy: {
      '/files': {
        target: devServer,
        changeOrigin: true,
        secure: false,
      },
      '/envs': {
        target: devServer,
        changeOrigin: true,
        secure: false,
      },
      '/run': {
        target: devServer,
        changeOrigin: true,
        secure: false,
      }
    }
}}
)