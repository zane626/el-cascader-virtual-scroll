const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')

function resolve (dir) {
  return path.join(__dirname, '../examples', dir)
}

module.exports = merge(baseWebpackConfig, {
  entry: './examples/index.js',
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.json'],
    alias: {
      'store': resolve('store'),
      'xhr': resolve('xhr')
    }
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    hot: true,
    host: 'localhost',
    contentBase: false,
    compress: true,
    overlay: true,
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join('/', 'index.html') }
      ],
    },
    publicPath: '/',
    port: 9009
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})
