'use strict';


var gulp = require('gulp');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var merge = require('merge-stream');
var mocha = require('gulp-mocha');
var mochaBabel = require('mocha-babel');
var zip = require('gulp-zip');

var options = {
	entries: ['./app/js/app.js'],
	debug: true
};

var b = watchify(browserify(options));
b.transform(babelify);
b.on('update', rebundle);
b.on('log', gutil.log);

function rebundle() {
	return b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify error'))
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist'));
}

gulp.task('lint', function() {
	return gulp.src('./app/js/**/.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('browserify', [ 'lint' ], function() {
	return rebundle();
});

gulp.task('clean', function(cb) {
	return del(['dist']);
});

gulp.task('copy:images', function() {
	return gulp.src('app/images/**')
		.pipe(gulp.dest('dist/images'));
});

gulp.task('copy:manifest', function() {
	return gulp.src('app/manifest.json')
		.pipe(gulp.dest('dist'));
});

gulp.task('copy:css', function() {
	var custom = gulp.src(['app/styles/**/*.css'])
		.pipe(minifyCss())
		.pipe(concat('style.css'))
		.pipe(gulp.dest('dist/styles'));

	var vendor = gulp.src(['node_modules/angular-material/angular-material.min.css'])
		.pipe(gulp.dest('dist/styles'));
	return merge(custom, vendor);
});

gulp.task('copy:html', function() {
	var index = gulp.src('app/index.html')
		.pipe(gulp.dest('dist'));
	var partials = gulp.src('app/partials/**/*.html')
		.pipe(gulp.dest('dist/partials'));
	return merge(index, partials);
});

gulp.task('copy', ['copy:images', 'copy:manifest', 'copy:css', 'copy:html' ]);

gulp.task('test', ['lint'], function() {
	return gulp.src(['app/**/*.test.js'], { read: false })
		.pipe(mocha({ 
			compilers: {
				js: mochaBabel
			}
		}));
});

gulp.task('build', ['browserify', 'copy']);

gulp.task('watch', function() {
	gulp.watch(['app/js/**/*.js'], ['browserify', 'test']);

	gulp.watch('app/manifest.json', ['copy:manifest']);
	gulp.watch('app/images/**', ['copy:images']);
	gulp.watch('app/styles/**/*.css', ['copy:css']);
	gulp.watch(['app/index.html', 'app/partials/**/*.html'], ['copy:html']);
});

gulp.task('zip', ['build'], function() {
	var manifest = require('./dist/manifest.json'),
		distFileName = manifest.name + ' v' + manifest.version + '.zip';

	return gulp.src(['dist/**', '!dist/**/*.map'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('packages'));
});

gulp.task('default', ['test', 'build', 'watch']);

