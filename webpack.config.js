const CleanPlugin = require('clean-webpack-plugin');
const VisualizerPlugin = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StatsPlugin = require('stats-webpack-plugin');

const rules = [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: 'ts-loader'
  }
];

const plugins = [
  new CleanPlugin([`./dist`]),
  new StatsPlugin(`./dist/@stat/webpack.json`, {}, false),
  new VisualizerPlugin({
    filename: `./dist/@stat/visualization.html`
  }),
  new BundleAnalyzerPlugin({
    openAnalyzer: false,
    analyzerMode: 'static',
    reportFilename: `./dist/@stat/bundle.html`
  })
];

module.exports = () => ({
  entry: `./src/index.ts`,
  output: {
    path: __dirname,
    filename: `dist/ligui.min.js`,
    libraryTarget: 'umd'
  },
  stats: {
    source: false
  },
  profile: true,
  devtool: 'source-map',
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
  },
  module: {
    rules
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.tsx','.json', '.webpack.js'],
  }
});
