import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:    resolve(__dirname, 'index.html'),
        produtos: resolve(__dirname, 'produtos.html'),
        admin:   resolve(__dirname, 'admin.html'),
        code:    resolve(__dirname, 'code.html'),
        sobre:   resolve(__dirname, 'sobre.html'),
      }
    }
  }
})
