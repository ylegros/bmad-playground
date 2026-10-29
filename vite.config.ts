import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const dataMode = env.VITE_DATA_MODE ?? (mode === 'bundled' ? 'bundled' : 'local');
  if (!['local', 'bundled'].includes(dataMode)) throw new Error('VITE_DATA_MODE must be local or bundled.');
  const base = env.VITE_BASE_PATH ?? '/';
  if (!base.startsWith('/') || base.startsWith('//') || base.includes('..') || /[?#\\]/.test(base)) throw new Error('VITE_BASE_PATH must be a same-origin absolute path.');
  return {
  base,
  define: { 'import.meta.env.VITE_DATA_MODE': JSON.stringify(dataMode) },
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5173, strictPort: true, proxy: { '/api': 'http://127.0.0.1:3001' } },
  build: { outDir: 'dist' },
}; });
