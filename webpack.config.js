const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const dist = "./dist";

const plugins = [
  new CleanWebpackPlugin(dist),
  new BundleAnalyzerPlugin({
    openAnalyzer: false,
    analyzerMode: 'static',
    reportFilename: `${__dirname}/bundle-report.html`
  })
];

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

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  output: {
    filename: `${dist}/ligui.min.js`,
    library: "ligui",
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules
  },
  plugins
};
