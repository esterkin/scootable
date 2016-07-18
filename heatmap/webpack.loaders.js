module.exports = [
	// Needed to add two loaders below
	// For integrating w/ mapbox-gl-js
	//https://github.com/uber/react-map-gl/issues/21
	{
		test: /\.json$/,
		loader: "json-loader"
	},
	{
        test: /use_program\.js$/,
		loader: 'transform/cacheable?brfs'
	},


	{
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components)/,
		loaders: ['react-hot', 'babel']
	},
	{
		test: /\.css$/,
		loader: 'style-loader!css-loader'
	},
	{
		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
		loader: "file"
	},
	{
		test: /\.(woff|woff2)$/,
		loader: "url?prefix=font/&limit=5000"
	},
	{
		test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
		loader: "url?limit=10000&mimetype=application/octet-stream"
	},
	{
		test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
		loader: "url?limit=10000&mimetype=image/svg+xml"
	},
	{
		test: /\.gif/,
		loader: "url-loader?limit=10000&mimetype=image/gif"
	},
	{
		test: /\.jpg/,
		loader: "url-loader?limit=10000&mimetype=image/jpg"
	},
	{
		test: /\.png/,
		loader: "url-loader?limit=10000&mimetype=image/png"
	}
];
