import { defineConfig } from 'vite';

export default defineConfig({
    // root: 'public', ← УБИРАЕМ
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true
    }
});