/* eslint max-len: 0 */
import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';
import path from 'path';

export default merge(baseConfig, {
  debug: true,

  devtool: 'cheap-module-eval-source-map',

  entry: {
    bundle: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
      'webpack/hot/only-dev-server',
      './app/index'
    ],
    proxy: './app/web_proxy'
  },

  output: {
    publicPath: 'http://localhost:3000/dist/',
    filename: "[name].js"
  },

  module: {
    loaders: [
      {
       test: /\.js$/,
       loaders: ['react-hot', 'babel'],
       include: path.join(__dirname, 'app')
      },
      {
        test: /\.global\.css$/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap'
        ]
      },

      {
        test: /^((?!\.global).)*\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],

  target: 'electron-renderer'
});
