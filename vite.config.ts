/// <reference types="vitest" />
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@assets': path.resolve(__dirname, './src/assets')
    },
  },
  base: "./",
  test: {
    globals: true,
    environment: 'jsdom'
  },
  build: {
    sourcemap: true,
    ssrManifest: true,
    outDir: 'dist'
  },
  plugins: [
    preact(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: "vite-pwa-demo",
        short_name: "pwa-demo",
        description: "simple pwa demo with vite, preact, and typescript",
        start_url: "/",
        icons: [
            {
                "src": "vite.svg",
                "sizes": "512x512"
            }
        ],
        theme_color: "#eeffee",
        background_color: "#eeffee",
        display: "standalone"
      }
    })
  ],
})
