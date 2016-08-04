var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: '#inline-source-map',
	entry: [
		'./src/js'
	],
	output: {
		path: path.join(__dirname, 'dev/assets/js'),
		filename: 'index.js',
	},
	plugins: [
	],
	resolve: {
		modulesDirectories: ['node_modules'],
		extentions: ['', '.js'],
		alias: {
		}
	},
	devServer: {
	},
	module: {
		noParse: [
			],
			loaders: [
			{   
				test: /\.js$/, 
				loader: 'babel',
				include: [
				path.join(__dirname, '/src/js'),
				], 
				query: {
					cacheDirectory: true,
	          		presets: ['es2015', 'react', 'stage-2']
	      		}
	  		},
  		]
	}
};
