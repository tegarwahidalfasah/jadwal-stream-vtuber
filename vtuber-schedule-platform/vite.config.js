import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Harus absolut: aplikasi memakai BrowserRouter dengan route bertingkat
  // (/user/dashboard, /editor/:id). base './' membuat asset di-resolve
  // relatif terhadap URL dokumen, sehingga route 2+ segmen blank page.
  base: '/',
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
