import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const devPort = Number(process.env.PORT) || 3000

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: devPort,
    strictPort: false,
    open: true,
    // Omit hmr.port so it always follows the real dev server port (CLI `--port` overrides config).
    // If the page is opened on a different forwarded port, set VITE_HMR_CLIENT_PORT to match.
    hmr: {
      protocol: 'ws',
      ...(process.env.VITE_HMR_CLIENT_PORT
        ? { clientPort: Number(process.env.VITE_HMR_CLIENT_PORT) }
        : {}),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
})
