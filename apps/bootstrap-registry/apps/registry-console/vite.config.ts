import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  appType: 'spa',
  base: './',
  plugins: [react()],
  html: {
    cspNonce: '__MISEOS_CSP_NONCE__',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@generated': fileURLToPath(new URL('./src/generated', import.meta.url)),
    },
    tsconfigPaths: true,
  },
  oxc: {
    target: 'es2022',
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    chunkImportMap: true,
    sourcemap: true,
    license: {
      fileName: 'license.md',
    },
    rollupOptions: {
      output: {
        manualChunks: {
          registry: ['./src/generated/index.json', './src/generated/analytics.json'],
          roster: ['./src/data/master-roster.generated.ts'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
})
