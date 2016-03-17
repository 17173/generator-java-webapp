'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var moment = require('moment');
var less = require('gulp-less');
var minifyCSS = require('gulp-css');

var join = require('path').join;


var pkg = require('./package.json');

gulp.task('clean', ['postapp'], function () {
  return gulp.src(join('dist', pkg.name), {read: false})
    .pipe(clean());
});

gulp.task('postapp', function() {
  var src = 'dist/' + pkg.name + '/' + pkg.version + '/src/**';
  var reg = new RegExp(pkg.name + '\/' + pkg.version + '\/src\/app\/', 'ig');

  return gulp.src(src)
    .pipe(replace(reg, ''))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('sea-config', function() {
  return gulp.src('src/js/sea-config.js')
    .pipe(replace('@VERSION', moment().format('YYYYMMDDhhss')))
    .pipe(replace(/\'@DEBUG\'/, false))
    .pipe(replace('@COPYRIGHT', pkg.name + '-v' + pkg.version))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));

});

gulp.task('less-dist', function() {
  return gulp.src('./src/css/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('less-src', function() {
  return gulp.src('./src/css/*.less')
    .pipe(less())
    .pipe(gulp.dest('./src/css'));
});


gulp.task('jshint', function() {
  return gulp.src(['./app/**/*.js'])
    .pipe(jshint());
});


gulp.task('postbuild', ['clean', 'sea-config']);
