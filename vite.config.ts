import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const target = loadEnv(mode, process.cwd()).VITE_API_PROXY_TARGET

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      proxy: target
        ? { '/__api': { target, changeOrigin: true, rewrite: (p) => p.replace(/^\/__api/, '') } }
        : undefined,
    },
  }
})
