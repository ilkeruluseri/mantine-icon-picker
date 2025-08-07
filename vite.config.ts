/// <reference types="vitest/config" />
import { join, resolve } from 'node:path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { peerDependencies } from './package.json';

export default defineConfig({
    build: {
        lib: {
            cssFileName: 'style',
            entry: resolve(__dirname, join('lib', 'index.ts')),
            fileName: 'index',
            formats: ['es', 'cjs'],
        },
        minify: false,
        rollupOptions: {
            // Exclude peer dependencies from the bundle to reduce bundle size
            external: ['react/jsx-runtime', ...Object.keys(peerDependencies)],
        },
        target: 'esnext',
    },
    plugins: [
        react(),
        dts({ rollupTypes: true }), // Output .d.ts files
    ],
    test: {
        coverage: {
            all: false,
            enabled: true,
        },
        environment: 'jsdom',
        globals: true,
        mockReset: true,
        setupFiles: './lib/test/setup.ts',
    },
});
