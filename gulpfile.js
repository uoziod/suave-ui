var gulp       = require('gulp'),
	concat     = require('gulp-concat'),
	uglify     = require('gulp-uglify'),
	ngAnnotate = require('gulp-ng-annotate'),
	minifyCSS  = require('gulp-minify-css'),
	sass       = require('gulp-sass'),
	sourceMaps = require('gulp-sourcemaps'),
	notify     = require('gulp-notify'),
	rename     = require('gulp-rename');

gulp.task('styles', function () {
	gulp.src('styles/style.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(minifyCSS())
		.pipe(rename('styles.min.css'))
		.pipe(gulp.dest('build'));
});

gulp.task('scripts', function () {
	gulp.src(['scripts/*.js', 'scripts/**/*.js'])
		.pipe(ngAnnotate()).on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(sourceMaps.init())
			.pipe(concat('app'))
			.pipe(uglify()).on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(sourceMaps.write())
		.pipe(rename({
			extname: ".min.js"
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
	gulp.watch(['styles/*.scss', 'styles/**/*.scss'], ['styles']);
	gulp.watch(['scripts/*.js', 'scripts/**/*.js'], ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'watch']);
