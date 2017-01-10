var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

var config = require('./webpack.base.config.js');

config.output.path = path.resolve('./memory/static/bundles/prod/');
config.bail = true;

config.plugins = config.plugins.concat([
  new BundleTracker({filename: './webpack-stats-prod.json'}),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production'),
    },
  }),
  // new webpack.optimize.UglifyJsPlugin(),
]);

config.module.loaders.push({
  test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel',
});

module.exports = config;
