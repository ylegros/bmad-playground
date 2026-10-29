import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['app/client/**/*.test.ts'], environment: 'node' } });
