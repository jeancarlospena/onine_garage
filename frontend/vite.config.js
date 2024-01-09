import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// const enviroment = process.env.NODE_ENV === 'development' ? "http://localhost:3000" : 'https://online-garage.onrender.com'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": 'https://dashboard.render.com',
    },
  },
  plugins: [react()],
})
