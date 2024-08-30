import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@constants': path.resolve(__dirname, './src/constants')
    },
  },
  plugins: [preact()],
})
