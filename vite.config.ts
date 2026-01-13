import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      'react/jsx-runtime': 'solid-js/jsx-runtime',
      'react/jsx-dev-runtime': 'solid-js/jsx-dev-runtime',
      react: 'solid-js',
    },
  },
  optimizeDeps: {
    rolldownOptions: {
      resolve: {
        alias: {
          'react/jsx-runtime': 'solid-js/jsx-runtime',
          'react/jsx-dev-runtime': 'solid-js/jsx-dev-runtime',
          react: 'solid-js',
        },
      },
    },
  },
})
