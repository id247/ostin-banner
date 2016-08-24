var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: '#inline-source-map',
	entry: {
		'b-970':[
			'./src/js/b-970'
		],
		'branding':[
			'./src/js/branding'
		],
		'branding-2':[
			'./src/js/branding-2'
		],
	},
	output: {
		path: path.join(__dirname, 'dev/assets/js'),
		filename: '[name].js',
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
