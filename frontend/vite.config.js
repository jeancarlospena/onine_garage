import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// const enviroment = import.meta.env.VITE_NODE_ENV === 'development' ? "http://localhost:3000" : 'https://online-garage.onrender.com'

// console.log('hi there')


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": 'https://online-garage.onrender.com',
    },
  },
  plugins: [react()],
})
