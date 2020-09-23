const {SourceMapDevToolPlugin} = require("webpack");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");

const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    devtool: "cheap-module-source-map",
    entry: ["babel-polyfill", path.resolve(__dirname, "app/index.tsx")],
    resolve: {
        alias: {
            app: path.resolve(__dirname, "app/"),
            static: path.resolve(__dirname, "static/"),
        },
        extensions: [".wasm", ".mjs", ".js", ".json", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    { loader: "css-loader", options: { importLoaders: 1} },
                    "postcss-loader",
                ]
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                }],
            },
            {
                test: /\.html$/,
                use: [
                    { loader: "html-loader" },
                ]
            }
        ],
    },
    plugins: [
        new ErrorOverlayPlugin(),
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, "src/index.html"),
            filename: "index.html",
        }),
        //new SourceMapDevToolPlugin({}),
    ]
};