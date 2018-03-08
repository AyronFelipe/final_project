const path = require('path')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    context: __dirname,
    entry: {
        app: './assets/js/app',
        home: './assets/js/home'
    },
    output: {
        path: path.resolve('./assets/bundles/'),
        filename: '[name]-[hash].js',
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react']
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    resolve: {
        modules: ['node_modules'],
        extensions: ['*', '.js', '.jsx']
    }
}