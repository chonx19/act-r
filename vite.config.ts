import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Set base path for GitHub Pages
    // Use /act-r/ for GitHub Pages, / for local development
    const isProduction = mode === 'production' || process.env.GITHUB_PAGES === 'true';
    const base = isProduction ? '/act-r/' : '/';
    
    return {
      base: base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      preview: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'chart-vendor': ['recharts'],
              'pdf-vendor': ['jspdf', 'jspdf-autotable'],
              'excel-vendor': ['xlsx'],
            },
          },
        },
      },
      plugins: [
        react(),
        // HTML plugin to transform paths
        {
          name: 'html-transform',
          transformIndexHtml(html) {
            // Vite will automatically transform paths, but we ensure base is applied
            return html;
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
