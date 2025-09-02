import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend bude běžet na localhost:5173
    
    // Nastavení proxy pro API požadavky
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend server běží na portu 3001
        changeOrigin: true, // Změní origin hlavičku na cílový server
        secure: false, // Povolí nebezpečné připojení (pro vývoj)
        
        // Odstraní /api z cesty při přesměrování na backend
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})