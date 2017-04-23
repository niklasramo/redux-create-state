var pkg = require('./package.json');
var gulp = require('gulp');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var size = require('gulp-size');
var runSequence = require('run-sequence');
var jsdocParse = require('jsdoc-parse');

gulp.task('validate', function () {

  return gulp
  .src(pkg.main)
  .pipe(jscs())
  .pipe(jscs.reporter());

});

gulp.task('compress', function() {

  var mainMinified = pkg.main.replace('.js', '.min.js');

  return gulp
  .src(pkg.main)
  .pipe(size({title: 'development'}))
  .pipe(uglify({
    preserveComments: 'some'
  }))
  .pipe(size({title: 'minified'}))
  .pipe(size({title: 'gzipped', gzip: true}))
  .pipe(rename(mainMinified))
  .pipe(gulp.dest('./'));

});

gulp.task('default', function (done) {
  runSequence('validate', 'compress', done);
});