import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [],
  base: mode === 'production' ? '/notepad-local/' : '/',
  build: {
    target: 'esnext',
  },
}))
