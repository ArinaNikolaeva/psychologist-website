import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true
    },
    // Только для продакшена
    base: process.env.NODE_ENV === 'production' ? '/psychologist-website/' : '/'
});