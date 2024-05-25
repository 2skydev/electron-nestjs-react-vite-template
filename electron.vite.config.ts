import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'

import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
      plugins: [react()],
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
