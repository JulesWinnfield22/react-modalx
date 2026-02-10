import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { modalTypesPlugin } from '../../components/modalxPlugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    modalTypesPlugin()
  ],
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'zustand': path.resolve(__dirname, './node_modules/zustand'),
    },
  },
})
