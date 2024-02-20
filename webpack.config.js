var path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './app/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        // publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"],
                        plugins: [
                            // "jsx-control-statements",
                            require.resolve('react-refresh/babel')
                        ]
                    }
                }
            },
            {
                test:/\.(png|gif|jpg|svg)$/,
                use:[
                    {
                        loader: "file-loader",
                        options: {
                            name: 'assets/[hash].[ext]'
                        }
                    }
                ]
            },
            { // Loader para css
                test: /\.css$/,
                use:  ['style-loader','css-loader']
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
        ]
    },

    plugins:[
        new HtmlWebPackPlugin({
            template: "./index.html",
            filename: "index.html"
        }),
        new MiniCssExtractPlugin(),
        new ReactRefreshWebpackPlugin()
    ],
    // resolve: {
    //     extensions: ['.js']
    // },
    devServer: {
        historyApiFallback:true,
        compress: true,
        hot: true
    }
}
