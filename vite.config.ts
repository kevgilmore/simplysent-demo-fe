import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    host: true, // Listen on all addresses (needed for WSL2)
    strictPort: true, // Fail if port is already in use
    watch: {
      // Exclude directories that don't need to be watched
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.vite/**',
        '**/.git/**',
        '**/coverage/**',
        '**/*.log',
      ],
      // Use polling in WSL2 for better reliability (optional, but can help)
      // Uncomment if file watching is still unreliable:
      // usePolling: true,
      // interval: 1000,
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    // Exclude large dependencies from pre-bundling if needed
    exclude: [],
    // Include dependencies that should be pre-bundled
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
})
