import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({

  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
   server: {
    proxy: {
      '/vicecity': {
        target: 'http://backend:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vicecity/, '')
      }
    },
    host: true,
        allowedHosts: [
      '.ngrok-free.dev', // allows all ngrok-free.dev subdomains
    ]
  }
})


