
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          $fa-font-path: '/node_modules/@fortawesome/fontawesome-free/webfonts';
          @use '/node_modules/@fortawesome/fontawesome-free/scss/fontawesome';
          @use '/node_modules/@fortawesome/fontawesome-free/scss/solid';

        `
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      'vue': 'vue/dist/vue.esm.js' // Use the runtime + compiler build
    },
    extensions: ['.js', '.ts', '.vue', '.json'] // Add .vue here
  }
});