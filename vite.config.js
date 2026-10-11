import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    chunkSizeWarningLimit: 800, // la escena 3D (three.js) se carga aparte
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        aviso: resolve(import.meta.dirname, 'aviso-de-privacidad.html')
      }
    }
  },
  server: { host: true } // para abrirlo desde el celular en la misma red
});
