import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'

export default defineConfig(() => {
  return {
    main: {
      plugins: [externalizeDepsPlugin(), swcPlugin()],
      build: {
        watch: {},
        sourcemap: true,
      },
      resolve: {
        alias: {
          '@main': resolve('src/main'),
        },
      },
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
    },
    renderer: {
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@main': resolve('src/main'),
          '@renderer': resolve('src/renderer/src'),
        },
      },
      server: {
        port: 3000,
        strictPort: true,
      },
      build: {
        sourcemap: true,
      },
    },
  }
})
