var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  entry: {
    // Add as many entry points as you have container-react-components here
    app: './react/App',
    vendors: ['react'],
  },

  output: {
    path: path.resolve('./memory/static/bundles/local/'),
    filename: "[name]-[hash].js"
  },

  externals: [
  ], // add all vendor libs

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
  ], // add all common plugins here

  module: {
    loaders: [
      { test: /\.json$/, loaders: ['json-loader'] },
    ],
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  },
}
