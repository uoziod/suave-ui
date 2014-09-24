var gulp          = require('gulp'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	ngAnnotate    = require('gulp-ng-annotate'),
	templateCache = require('gulp-angular-templatecache'),
	minifyCSS     = require('gulp-minify-css'),
	sass          = require('gulp-sass'),
	sourceMaps    = require('gulp-sourcemaps'),
	notify        = require('gulp-notify'),
	jade          = require('gulp-jade'),
	rename        = require('gulp-rename');

gulp.task('styles', function () {
	gulp.src('./styles/style.scss')
		.pipe(sass()).on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(minifyCSS({
			keepSpecialComments: 0
		}))
		.pipe(rename('styles.min.css'))
		.pipe(gulp.dest('./build'));
});

gulp.task('templates', function () {
	gulp.src('./templates/**/*.tmpl')
		.pipe(templateCache({
			module: 'su-templates',
			standalone: true
		}))
		.pipe(gulp.dest('./scripts'));
});

gulp.task('scripts', function () {
	gulp.src(['./scripts/**/*.js'])
		.pipe(ngAnnotate()).on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(sourceMaps.init())
		.pipe(concat('app.min.js'))
		.pipe(uglify()).on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(sourceMaps.write('./'))
		.pipe(gulp.dest('./build'));
});

gulp.task('demo-views', function() {
	gulp.src('./demo/src/views/*.jade')
		.pipe(jade({
			locals: require('./demo/src/config')
		})).on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(gulp.dest('./demo/'));
});

gulp.task('demo-styles', function() {
	gulp.src('./demo/src/styles/style.scss')
		.pipe(sass()).on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(minifyCSS({
			keepSpecialComments: 0
		}))
		.pipe(rename('styles.min.css'))
		.pipe(gulp.dest('./demo/res'));
});

gulp.task('watch', function () {
	gulp.watch(['./styles/**/*.scss'], ['styles']);
	gulp.watch(['./templates/**/*.tmpl'], ['templates']);
	gulp.watch(['./scripts/**/*.js'], ['scripts']);
	gulp.watch(['./demo/src/**/*.jade', './demo/src/js/demo.js'], ['demo-views']);
	gulp.watch(['./demo/src/styles/**/*.scss'], ['demo-styles']);
});

gulp.task('default', ['styles', 'templates', 'scripts', 'demo-views', 'demo-styles', 'watch']);
