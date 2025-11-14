import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
   build: {
    rollupOptions: {
      input: {
        login: './login.html',
        signup: './signup.html'
      }
    }
  },
  plugins: [
    tailwindcss(),
  ],
})