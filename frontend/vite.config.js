// vite.config.js
import { defineConfig } from 'vite'

const serverPort=3001
const websitePort=3002
const server = "http://localhost:" + serverPort.toString()

export default defineConfig({
  server: {
    port: websitePort,
    proxy: {
      '/files': {
        target: server,
        changeOrigin: true,
        secure: false,
      },
      '/envs': {
        target: server,
        changeOrigin: true,
        secure: false,
      },
      '/run': {
        target: server,
        changeOrigin: true,
        secure: false,
      }
    }
}}
)