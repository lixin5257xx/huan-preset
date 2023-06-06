/*
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2022-04-12 18:08:25
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-06-06 19:14:34
 * @FilePath: \huan-preset\template\vite.config.ts
 * @Description:
 *
 * Copyright (c) 2022 by lixinxin lixinxin@huan.tv, All Rights Reserved.
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import path from 'path'
import viteCompression from 'vite-plugin-compression' //vite-plugin-compression 开启gzip压缩
const sentryConfig: any = {
  authToken: '691c4beb98bd4be58523065f85aef32e8f480c7fec25432388d362ee0ba0892e',
  configFile: './.sentryclirc',
  project: 'operation',
  include: './dist',
  org: 'lixin5257xx',
  slug: 'lixin5257xx',
  release: 'operation@1.5.0', // package.json version 保持同步
  deploy: {
    env: 'production',
  },
  setCommits: {
    auto: true,
  },
  urlPrefix: '~',
  skipEnvironmentCheck: true, // 可以跳过环境检查
  sourceMaps: {
    include: ['./dist/assets'],
    ignore: ['node_modules'],
    urlPrefix: '~/assets',
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@views': path.resolve(__dirname, 'src/views/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@api': path.resolve(__dirname, 'src/config/api/index.ts'),
    },
  },
  plugins: [
    vue(),
    Components({
      /* options */
    }),
    viteCompression({
      //生成压缩包gz
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  base: '/',
  server: {
    host: '0.0.0.0',
  },
  build: {
    minify: 'terser', // 混淆器，terser构建后文件体积更小
    chunkSizeWarningLimit: 1500,
    terserOptions: {
      compress: {
        // 生产环境移除 console
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap:
      process.env.NODE_ENV === 'production' &&
      ['test', 'sentry'].includes(process.env.NODE_TYPE as string)
        ? true
        : false,
    // sourcemap:
    //   process.env.NODE_ENV === 'production' &&
    //   process.env.NODE_TYPE === 'sentry'
    //     ? true
    //     : false,
    rollupOptions: {
      //块的大小超过限制
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        },
      },
    //   external: ['@antv/s2','ant-design-vue'],
    },
  },
})
