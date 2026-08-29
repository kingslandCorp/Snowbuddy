import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Local dev has no Worker, so proxy webcam snapshot requests to
      // production's KV-backed route -- real captured photos locally too.
      "/webcam-snapshot": {
        target: "https://www.snowbuddy.co.uk",
        changeOrigin: true,
      },
    },
  },
})
