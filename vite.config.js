import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

import compressPlugin from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    // 按需引入antd
    Components({
      resolvers: [AntDesignVueResolver()]
    }),
    compressPlugin()
  ],

  // 别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/style/mixin.scss";'
      }
    }
  }

  // 代理
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://81.70.234.149:9002',
  //       changeOrigin: true
  //       // rewrite: path => path.replace(/^\/api/, '/api')
  //     }
  //   }
  // }
})
