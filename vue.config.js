'use strict'
const path = require('path')
// 基础配置
const config = require('./src/config.js')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = config.title

module.exports = {
  // history 对应 /, hash 对应 ./
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  // 生产环境是否构建生成 source map, 可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,
  // 本地服务的配置
  devServer: {
    port: config.port,
    open: true,
    // 设置跨域代理
    proxy: {
      '/api/': {
        target: config.proxy.api,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/sso/': {
        target: config.proxy.sso,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/sso': '/'
        }
      }
    }
  },

  configureWebpack: config => {
    config.name = name
    config.resolve.alias = {
      '@': resolve('src'),
      '@c': resolve('src/components'),
      '@u': resolve('src/utils'),
      '@v': resolve('src/views')
    }

    config.devtool = 'source-map'

    config.externals = {
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      moment: 'moment',
      axios: 'axios'
    }
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/colors.scss";
          @import "@/styles/atom.scss";
          @import "@/styles/config.scss";
          @import "@/styles/element-ui.scss";
          @import "@/styles/flex.scss";
          @import "@/styles/global.scss";
          @import '@/styles/transition.scss';
        `
      }
    }
  }
}
