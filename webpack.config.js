const CreateVariants = require('parallel-webpack').createVariants;
const VisualizerWebpackPlugin = require('webpack-visualizer-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => {

  const plugins = [];

  if (env['production']) {
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
    }
  ];

  const variantsOptions = {
    entry: ['core', 'preact', 'react']
  };

  return CreateVariants({}, variantsOptions, options => {
    return {
      entry: `./@${options.entry}/src/index.ts`,
      output: {
        path: __dirname,
        filename: `@${options.entry}/dist/ligui.${options.entry}.min.js`
      },
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
  });
};
