const path = require('path')
const webpack = require('webpack')

module.exports = {
    context: __dirname,
    entry: {
        app: './assets/js/app',
        home: './assets/js/home'
    },
    output: {
        path: path.resolve('./assets/bundles/'),
        filename: '[name].js',
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    },

    resolve: {
        modules: ['node_modules'],
        extensions: ['*', '.js', '.jsx']
    },

    devServer: {
        historyApiFallback: true,
    },
}