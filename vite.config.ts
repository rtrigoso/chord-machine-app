/// <reference types="vitest" />
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path';

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
  plugins: [preact()],
})
