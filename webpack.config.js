const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = {
    entry: `./src/ligui.ts`,
    output: {
        filename: `./ligui.min.js`,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
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
                configFile: 'tsconfig.webpack.json'
            }
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerMode: 'static',
            reportFilename: `${__dirname}/report/bundle-report.html`
        })
    ],
    externals: {
        'react': 'react',
        'react-dom': 'react-dom',
        'mobx': 'mobx',
        'inversify': 'inversify'
    },
};
