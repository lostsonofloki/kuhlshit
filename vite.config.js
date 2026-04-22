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
    // Source maps ship ~750KB of .map alongside the JS; PSI doesn't run them,
    // but they still cost network + Vercel bandwidth. Disable in prod.
    sourcemap: false,
    cssCodeSplit: true,
    // Default is 4kb — keep inlining small assets so fewer tiny requests hit the wire.
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Split vendors out of the main entry so the app code is small and
        // highly cacheable. React + Router almost never change, so they can
        // stay cached across deploys.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('react-dom') || id.includes('scheduler')) return 'vendor-react-dom'
          if (id.includes('/react/')) return 'vendor-react'
          if (id.includes('@vercel/analytics') || id.includes('@vercel/speed-insights')) {
            return 'vendor-vercel'
          }
          return 'vendor'
        },
      },
    },
  },
})
