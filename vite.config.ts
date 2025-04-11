// Copyright (c) 2025 BytePlus Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import externalGlobals from 'rollup-plugin-external-globals';
import { createHtmlPlugin } from 'vite-plugin-html';
import postCssPxToRem from 'postcss-pxtorem';
import autoprefixer from 'autoprefixer';
import path from 'path';
import svgr from 'vite-plugin-svgr';

const isProd = process.env.NODE_ENV === 'production';
const isPPE = process.env.CUSTOM_IS_PPE === '1';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: { isProd, envName: isProd ? 'production' : 'development' },
      },
    }),
  ],
  base: isProd ? '//mediaservice-fe.bytepluscdn.com/obj/vcloud-fe-sgcomm/video-one' : '/',
  server: {
    host: '0.0.0.0',
    port: 8000,
  },
  build: {
    outDir: 'output',
    rollupOptions: {
      external: ['react', 'react-dom'],
      plugins: [
        externalGlobals({
          react: 'React',
          'react-dom': 'ReactDOM',
        }),
      ],
    },
  },
  define: {
    __API_URL__: JSON.stringify(
      isPPE || !isProd ? '//rtc-sg-test.bytedance.com/videoone' : '//videocloud.byteplusapi.com/videoone',
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
      generateScopedName: '[local]-[hash:8]',
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
          grid: false,
        }),
      ],
    },
  },
});
