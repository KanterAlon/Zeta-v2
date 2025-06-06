import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (dev/prod)
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          // Si tu backend espera rutas sin `/api`, descomenta la siguiente línea:
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
