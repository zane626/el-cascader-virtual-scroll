const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
module.exports = merge(baseWebpackConfig, {
  context: path.resolve(__dirname, '../'),
  entry: './src/index.js',
  mode: 'production',
  output: {
    library: 'elCascaderVirtualScroll',
    libraryTarget: 'umd',
    publicPath: '/',
    filename: 'elCascaderVirtualScroll.js',
    path: path.resolve(__dirname, '../dist')
  },
  externals: [
    {
      'vue': {
        commonjs: 'vue',
        commonjs2: 'vue'
      }
    },
    {
      'element-ui': {
        commonjs: 'element-ui',
        commonjs2: 'element-ui'
      }
    }
  ]
})
