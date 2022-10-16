const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: "development",
	entry: {
		index: "./src/index.js",
	},
	devtool: "inline-source-map",
	// devServer: {
	// 	static: "./dist",
	// },
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "src/index.html",
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: "./static/favicon.ico" }],
		}),
	],
	optimization: {
		runtimeChunk: "single",
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
};
