'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); //lazy load some of gulp plugins

var fs = require('fs');
var watch = require('gulp-watch');
var spritesmith = require('gulp.spritesmith');

var devMode = process.env.NODE_ENV || 'development';

var destFolder = devMode === 'development' ? 'dev' : 'production';

var packageJson = JSON.parse(fs.readFileSync('./package.json'));

var CDN = packageJson.cdn;

if (!CDN){
	console.error('SET THE CDN!!!');
}

// STYLES
gulp.task('sass', function () {

	return gulp.src('src/sass/style.scss')
		.pipe($.if(devMode !== 'production', $.sourcemaps.init())) 
		.pipe($.sass({outputStyle: 'expanded'})) 
		.on('error', $.notify.onError())
		.pipe($.autoprefixer({
			browsers: ['> 1%'],
			cascade: false
		}))
		.pipe($.cssImageDimensions())
		.pipe($.if(devMode !== 'production', $.sourcemaps.write())) 
		.pipe(gulp.dest(destFolder + '/assets/css'));  
});

// image urls
gulp.task('modifyCssUrls', function () {
	fs = require('fs');
	$.revHash = require('rev-hash');

	return gulp.src(destFolder + '/assets/css/style.css')
		.pipe($.modifyCssUrls({
			modify: function (url, filePath) {
				var buffer = fs.readFileSync(url.replace('../', destFolder + '/assets/'));				
				return url + '?_v=' + $.revHash(buffer);
			},
		}))		
		.pipe($.minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest(destFolder + '/assets/css'));

});

// ASSETS
gulp.task('assets-files', function(){
	return gulp.src(['src/assets/**/*.*', '!src/assets/sprite/*.*', '!src/assets/favicon.ico'], {since: gulp.lastRun('assets-files')})
		.pipe($.newer(destFolder + '/assets'))
		.pipe(gulp.dest(destFolder + '/assets'))
});
gulp.task('assets-favicon', function(){
	return gulp.src('src/assets/favicon.ico', {since: gulp.lastRun('assets-favicon')})
		.pipe($.newer(destFolder))
		.pipe(gulp.dest(destFolder))
});
gulp.task('sprite', function(callback) {

	var spriteData = 
		gulp.src('src/assets/sprite/*.png') // путь, откуда берем картинки для спрайта
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: '_sprites.scss',
			imgPath: '../images/sprite.png'
		}))
		.on('error', $.notify.onError())
		

	spriteData.img
		.pipe(gulp.dest(destFolder + '/assets/images/'))

	spriteData.css.pipe(gulp.dest('src/sass/'));

	callback();
});
gulp.task('assets', gulp.parallel('assets-files', 'assets-favicon', 'sprite'));


// HTML
gulp.task('html', function(){

	return gulp.src([
		'src/html/*.html', 
		'!src/html/_*.html', 
		])
		.pipe($.if(devMode === 'production', $.htmlmin({collapseWhitespace: true})))
		.pipe(gulp.dest(destFolder));

});

gulp.task('webpack', function(callback) {
	$.webpack = require('webpack');
	$.webpackConfig = require('./webpack.config.js');
	
	var myConfig = Object.create($.webpackConfig);

	$.webpack(myConfig, 
	function(err, stats) {
		if(err) throw new $.util.PluginError('webpack', err);
		$.util.log('[webpack]', stats.toString({
			// output options
		}));
		callback();
	});
});

// BUILD
gulp.task('server', function () {
	$.server = require('gulp-server-livereload');

	gulp.src(destFolder)
	.pipe($.server({
		livereload: true,
		directoryListing: false,
		open: false,
		port: 9000
	}));

	gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
	gulp.watch('src/assets/**/*', gulp.series('assets'));
	gulp.watch('src/html/**/*.html', gulp.series('html'));
	gulp.watch('src/js/**/*.js', gulp.series('webpack'));

});


gulp.task('clean', function(callback) {
	$.del = require('del');
	return $.del([destFolder]);
});

gulp.task('build', gulp.series('webpack', 'assets', 'sass', 'html'));


//PUBLIC TASKS

//production

// npm run prod - build whole project to deploy in 'production' folder
gulp.task('prod', gulp.series('build', 'modifyCssUrls'));

// npm run prod-html - build only html in 'production' folder
gulp.task('prod-html', gulp.series('html'));

// npm run prod-css - build only css in 'production' folder
gulp.task('prod-css', gulp.series('sass', 'modifyCssUrls'));

//development

// run prod and hot-reload servers
gulp.task('servers', gulp.parallel('server'));

// gulp start - very first start to build the project and run server in 'dev' folder
gulp.task('start', gulp.series('clean', 'build', 'servers'));

// gulp - just run server in 'dev' folder
gulp.task('default', gulp.parallel('servers'));



