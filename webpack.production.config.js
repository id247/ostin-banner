'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
	cache: true,
	entry: {
		'970':[
			'babel-polyfill',
			'./src/js/970'
		],
		'branding':[
			'babel-polyfill',
			'./src/js/branding'
		],
	},
	output: {
		path: path.join(__dirname, '/production/assets/js'),
		filename: '[name].js',
	},

	resolve: {
		modulesDirectories: ['node_modules'],
		extentions: ['', '.js'],
		alias: {
		}
	},

	module: {
		noParse: [
		],
		loaders: [
			{   test: /\.js$/, 
				loader: 'babel',
				include: [
					path.join(__dirname, '/src/js'),
				], 
				query: {
					cacheDirectory: true,
					presets: ['es2015', 'react', 'stage-2']
				}
			},
			{ 	test: /\.js$/, 
				include: [
					path.join(__dirname, '/src/js'),
				], 
				loader: 'strip-loader?strip[]=console.log' 
			}
		]
	},
	plugins: [     
		// new webpack.DefinePlugin({
		// 	'process.env': { 
		// 		NODE_ENV : JSON.stringify('production') 
		// 	}
		// }),
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			comments: false,
			compress: {
				warnings: false
			}
		})
	]
};

