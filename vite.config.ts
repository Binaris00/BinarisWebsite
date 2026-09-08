import { defineConfig } from 'vitest/config'
import { cpSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    {
      name: 'copy-cards',
      closeBundle() {
        cpSync('cards', 'dist/cards', {
          recursive: true,
          filter: (src) => !src.includes('.obsidian') && !src.includes('.trash'),
        })
      },
    },
  ],
  test: {
    environment: 'node',
  },
})
