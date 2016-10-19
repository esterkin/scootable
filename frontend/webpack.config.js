"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var postLoaders = require('./webpack.postLoaders');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || "8888";

module.exports = {
	entry: [
		`webpack-dev-server/client?http://${HOST}:${PORT}`, // WebpackDevServer host and port
		`webpack/hot/only-dev-server`,
		`./index.jsx` // Your appʼs entry point
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js'
	},
	resolve: {
		// For integrating w/ mapbox-gl-js
		//https://github.com/uber/react-map-gl/issues/21
		alias: {
			'webworkify': 'webworkify-webpack'
		},
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: loaders,

		// For integrating w/ mapbox-gl-js
		//https://github.com/uber/react-map-gl/issues/21
		postLoaders: postLoaders
	},
	devServer: {
		contentBase: "./public",
			noInfo: true, //  --no-info option
			hot: true,
			inline: true,
			port: PORT,
			host: HOST
		},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new CopyWebpackPlugin([
			{from: './index.html'}
		]),
	],

	// mock 'fs' by creating an empty module
	//https://github.com/pugjs/pug-loader/issues/8#issuecomment-55568520
	node: {
		//fs: "empty"
	}
};
