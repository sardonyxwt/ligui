const path = require("path");
const CleanPlugin = require('clean-webpack-plugin');
const VisualizerPlugin = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StatsPlugin = require('stats-webpack-plugin');

const plugins = [
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
];

const rules = (transpileOnly) => [{
  test: /\.tsx?$/,
  exclude: /node_modules/,
  loader: 'ts-loader',
  options: {
    transpileOnly
  }
}];

const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `[name].ligui.min.js`,
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
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx','.json'],
  }
};

const webEnvConfig = {
  ...commonConfig,
  target: 'web',
  entry: {
    web: `./src/index.ts`
  },
  module: {
    rules: rules(false)
  },
  plugins
};


const nodeEnvConfig = {
  ...commonConfig,
  target: 'node',
  entry: {
    node: `./src/index.ts`
  },
  module: {
    rules: rules(true)
  },
};

module.exports = [webEnvConfig, nodeEnvConfig];
