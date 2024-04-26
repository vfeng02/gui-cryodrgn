// vite.config.js
import { defineConfig } from 'vite'

const serverPort=28019
const websitePort=52058
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