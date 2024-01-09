import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const enviroment = process.env.NODE_ENV === 'development' ? "http://localhost:3000" : 'https://dashboard.heroku.com'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": enviroment,
    },
  },
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'myLib',
      fileName: 'myLib',
    },
    rollupOptions: {
      external: [/^node:\w+/], // <-- ignores all 'node:*'
    },
  },
})
