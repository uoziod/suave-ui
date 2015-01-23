/* jshint ignore:start */

var gulp         = require('gulp'),
  concat         = require('gulp-concat'),
  uglify         = require('gulp-uglify'),
  ngAnnotate     = require('gulp-ng-annotate'),
  templateCache  = require('gulp-angular-templatecache'),
  minifyCSS      = require('gulp-minify-css'),
  sass           = require('gulp-sass'),
  sourceMaps     = require('gulp-sourcemaps'),
  notify         = require('gulp-notify'),
  jade           = require('gulp-jade'),
  rename         = require('gulp-rename'),
  jshint         = require('gulp-jshint'),
  mainBowerFiles = require('main-bower-files'),
  connect        = require('gulp-connect');

gulp.task('collect-components', function () {
  gulp.src(mainBowerFiles(), {base: './bower_components'})
    .pipe(gulp.dest('./components'));
});

gulp.task('styles', function () {
  gulp.src('./styles/styles.scss')
    .pipe(sourceMaps.init())
    .pipe(sass()).on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(minifyCSS({
      keepSpecialComments: 0
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());

  gulp.src('./styles/styles-bower.scss')
    .pipe(sourceMaps.init())
    .pipe(sass()).on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(minifyCSS({
      keepSpecialComments: 0
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('templates', function () {
  gulp.src('./templates/**/*.tmpl')
    .pipe(templateCache({
      module: 'su-templates',
      standalone: true
    }))
    .pipe(gulp.dest('./scripts'))
    .pipe(connect.reload());
});

gulp.task('scripts', function () {
  gulp.src(['./scripts/**/*.js'])
    .pipe(ngAnnotate()).on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(sourceMaps.init())
    .pipe(concat('app.min.js'))
    .pipe(uglify()).on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('jshint', function() {
  gulp.src(['./scripts/**/*.js', '!./scripts/templates.js'])
    .pipe(jshint())
    .pipe(notify(function (file) {
      if (file.jshint.success) {
        return false;
      }

      var errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");

      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }));
});

gulp.task('demo-views', function () {
  gulp.src('./demo/src/views/*.jade')
    .pipe(jade({
      locals: require('./demo/src/config')
    })).on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(gulp.dest('./demo/'))
    .pipe(connect.reload());
});

gulp.task('demo-styles', function () {
  gulp.src('./demo/src/styles/style.scss')
    .pipe(sass()).on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(minifyCSS({
      keepSpecialComments: 0
    }))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('./demo/res'))
    .pipe(connect.reload());
});

gulp.task('connect', function () {
  connect.server({
    root: './',
    port: 3030,
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(['./styles/**/*.scss'], ['styles']);
  gulp.watch(['./templates/**/*.tmpl'], ['templates', 'scripts']);
  gulp.watch(['./scripts/**/*.js'], ['scripts', 'jshint']);
  gulp.watch(['./demo/src/**/*.jade', './demo/src/js/demo.js'], ['demo-views']);
  gulp.watch(['./demo/src/styles/**/*.scss'], ['demo-styles']);
});

gulp.task('default', ['connect', 'collect-components', 'styles', 'templates', 'scripts', 'jshint', 'demo-views', 'demo-styles', 'watch']);

/* jshint ignore:end */
