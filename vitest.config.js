import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['src/**/*.+(tsx|ts)'],
      exclude: [
        '**/admin',
        '**/login',
        '**/usuario',
        '**/api',
        '**/stories',
        '**/middlewares',
        '**/constants',
        '**/interfaces',
        'src/**/*.stories.+(tsx|ts)'
      ],
    },
  },
})
