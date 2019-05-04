const path = require("path");
const CleanPlugin = require('clean-webpack-plugin');
const VisualizerPlugin = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StatsPlugin = require('stats-webpack-plugin');

const createCommonConfig = (type) => ({
  entry: `./src/ligui.${type}.ts`,
  output: {
    path: path.resolve(__dirname, 'module', type, 'dist'),
    filename: `./ligui.${type}.min.js`,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  stats: {
    source: false
  },
  profile: true,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx','.json'],
    alias: {
      '@src': path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
      options: {
        configFile: `tsconfig.${type}.json`
      }
    }]
  },
  plugins: [
    new CleanPlugin(),
    new StatsPlugin(`./@stat/webpack.json`, {}, false),
    new VisualizerPlugin({
      filename: `./@stat/visualization.html`
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: `./@stat/bundle.html`
    })
  ]
});

const webConfig = {
  ...createCommonConfig('web'),
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
  },
};

const nodeConfig = {
  ...createCommonConfig('node'),
  target: 'node'
};

module.exports = [webConfig, nodeConfig];
