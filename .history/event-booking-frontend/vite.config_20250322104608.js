import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // 👈 Change Vite's default 'dist' folder to 'build'
  }
});
