var webpack = require('webpack');
var path = require('path');

var loaders = require('./webpack.loaders');
var postLoaders = require('./webpack.postLoaders');

var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: [
		'./index.jsx' // Your appʼs entry point
	],
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: loaders,

        // For integrating w/ mapbox-gl-js
        //https://github.com/uber/react-map-gl/issues/21
        postLoaders: postLoaders
	},
	plugins: [
		new CopyWebpackPlugin([
			{from: './index.html'}
		]),
	]
};
