import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postCssPxToRem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';
import path from 'path';
import svgr from 'vite-plugin-svgr';

const isProd = process.env.NODE_ENV === 'production';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: isProd ? '//mediaservice-fe.bytepluscdn.com/obj/vcloud-fe-sgcomm/video-one' : '/',
  server: {
    port: 8000,
  },
  build: {
    outDir: 'output',
  },
  define: {
    __API_URL__: JSON.stringify(
      !isProd ? 'https://videocloud.byteplusapi.com/videoone' : 'https://rtc-sg-test.bytedance.com/videoone',
    ),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 100,
          propList: ['*', '!font-size'],
          exclude: /(node_module)/,
          mediaQuery: false,
          minPixelValue: 3,
        }),
        autoprefixer({
          overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ie >= 8', 'last 2 versions'],
          grid: true,
        }),
      ],
    },
  },
});
