const CleanWebpackPlugin = require('clean-webpack-plugin');
const VisualizerWebpackPlugin = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const dist = "./dist";

module.exports = env => {
  const plugins = [
    new CleanWebpackPlugin(dist)
  ];

  if(env['production']) {
    plugins.push(
      new VisualizerWebpackPlugin({
        filename: './bundle-statistics.html'
      }),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'static',
        reportFilename: './bundle-report.html'
      })
    )
  }

  const rules = [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'ts-loader'
    },
    {
      test: /\.tsx?$/,
      enforce: 'pre',
      loader: 'tslint-loader',
      options: {
        emitErrors: true,
        fix: true
      }
    }
  ];

  return {
    entry: {
      'common': './src/common/',
      'preact.ligui': './src/preact/preact.ligui.ts',
      'react.ligui': './src/react/react.ligui.ts'
    },
    devtool: 'source-map',
    output: {
      filename: `${dist}/[name].min.js`,
      libraryTarget: 'umd'
    },
    resolve: {
      extensions: ['.js', '.ts', '.json']
    },
    module: {
      rules
    },
    plugins
  }
};
