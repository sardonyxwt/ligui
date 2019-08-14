const path = require("path");
const VisualizerPlugin = require('webpack-visualizer-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = {
  entry: `./src/ligui.ts`,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `./ligui.min.js`,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  stats: {
    source: false
  },
  profile: true,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
      options: {
        configFile: `tsconfig.json`
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new StatsPlugin(`./@stat/webpack.json`, {}, false),
    new VisualizerPlugin({
      filename: `./@stat/visualization.html`
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: `./@stat/bundle.html`
    })
  ],
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
  },
};
