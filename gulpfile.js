var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	minifyCSS = require('gulp-minify-css'),
	sass = require('gulp-sass');

gulp.task('sass', function () {
	gulp.src('styles/style.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(minifyCSS({
			keepBreaks: true
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('scripts', function () {
	gulp.src(['scripts/*.js', 'scripts/**/*.js'])
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
	gulp.watch(['styles/*.scss', 'styles/**/*.scss'], ['sass']);
	gulp.watch(['scripts/*.js', 'scripts/**/*.js'], ['scripts']);
});

gulp.task('default', ['sass', 'scripts', 'watch']);