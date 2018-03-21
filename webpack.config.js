const CreateVariants = require('parallel-webpack').createVariants;
const CleanPlugin = require('clean-webpack-plugin');
const VisualizerPlugin = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StatsPlugin = require('stats-webpack-plugin');

function createConfig(options) {

  const ext = `${options.includeLib ? 'vendor' : 'lib'}`;

  const rules = [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'ts-loader'
    }
  ];

  const plugins = [
    new CleanPlugin([`./dist`]),
    new StatsPlugin(`./dist/@stat/webpack.${ext}.json`, {}, false),
    new VisualizerPlugin({
      filename: `./dist/@stat/visualization.${ext}.html`
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: `./dist/@stat/bundle.${ext}.html`
    })
  ];

  return {
    entry: `./src/index.ts`,
    output: {
      path: __dirname,
      filename: `dist/ligui.${ext}.min.js`
    },
    stats: {
      source: false
    },
    profile: true,
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.ts', '.json', '.webpack.js']
    },
    externals: options.includeLib ? {} : {
      'react': 'react',
      'react-dom': 'react-dom'
    },
    module: {
      rules
    },
    plugins
  }

}

const variantsOptions = {
  includeLib: [true, false]
};

module.exports = env => CreateVariants({env}, variantsOptions, createConfig);
