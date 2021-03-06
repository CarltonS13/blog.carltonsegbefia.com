'use strict';

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('gulp4-run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

var user = process.env.FTP_USER;
var pwd = process.env.FTP_PASSWORD;

var remoteLocation = 'blog/';

function getFtpConnection(){
    return ftp.create({
        host: "blog.carltonsegbefia.com",
        port: 21,
        user: user,
        password: pwd,
        parallel: 5,
        log: gutil.log
    })
}

//deploy to remote server
gulp.task('remote-deploy',function(){
    var conn = getFtpConnection();
    return gulp.src('public/**/*')
        .pipe(conn.newer(remoteLocation))
        .pipe(conn.dest(remoteLocation))
})

// Gulp task to minify CSS files
gulp.task('styles', function () {
  return gulp.src(['public/css/custom.css','public/css/skeleton.css','public/css/normalize.css'])
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer())
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('public/css'))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
  return gulp.src('public/js/**/*.js')
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('public/js'))
});

// Gulp task to minify HTML files
gulp.task('pages', function() {
  return gulp.src(['public/**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('public'));
});

// Gulp task to minify all files
gulp.task('default', async function () {
  runSequence(
    'styles',
    'scripts',
    'pages'
  );
});
