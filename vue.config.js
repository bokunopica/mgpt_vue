const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 跨域问题解决 需要重启服务
    proxy: {
      '/': {
        target: 'http://localhost:8888',
        changeOrigin: true
      }
    }
  }
})
