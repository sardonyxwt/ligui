const CleanWebpackPlugin = require('clean-webpack-plugin');
const CreateVariants = require('parallel-webpack').createVariants;
const VisualizerWebpackPlugin = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StatsPlugin = require('stats-webpack-plugin');

function createConfig(options) {

  const plugins = [
    new CleanWebpackPlugin([
      `./@${options.entry}/dist`]
    )
  ];

  const rules = [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'ts-loader'
    }
  ];

  if (options.env.statistic) {
    plugins.push(
      new StatsPlugin(`./@${options.entry}/dist/@stat/webpack.json`, {}, false),
      new VisualizerWebpackPlugin({
        filename: `./@${options.entry}/dist/@stat/visualization.html`
      }),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'static',
        reportFilename: `./@${options.entry}/dist/@stat/bundle.html`
      })
    )
  }

  return {
    entry: `./@${options.entry}/src/index.ts`,
    output: {
      path: __dirname,
      filename: `@${options.entry}/dist/ligui.${options.entry}.min.js`
    },
    profile: options.env.statistic,
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.ts', '.json'],
      alias: {
        '@core': `${__dirname}/@core/src/index.ts`
      }
    },
    module: {
      rules
    },
    plugins
  }

}

const variantsOptions = {
  entry: ['core', 'preact', 'react']
};

module.exports = env => CreateVariants({env}, variantsOptions, createConfig);
