const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { resolve } = require('path');

module.exports = {
    mode: "production",
    entry: {
        "laravel-ajax-form": "./src/ajax-form.index.ts",
        "laravel-ajax-form.min": "./src/ajax-form.index.ts",
    },
    output: {
        path: resolve(__dirname, 'umd'),
        filename: '[name].js',
        library: 'PackageName',
        libraryTarget: 'umd',
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                test: /\.min\.js$/,
                sourceMap: true,
            }),
        ],
    },

    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            }
        ],
    }
};
