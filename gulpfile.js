var gulp      = require('gulp'),
    mocha     = require('gulp-mocha'),
    istanbul  = require('gulp-istanbul'),
    coveralls = require('gulp-coveralls'),
    coffee = require('coffee-script/register');

// TODO : using coffeescript for lighter syntax
gulp.task('pre-test', function(){
  return gulp.src(['app.js', 'routes/*.js', 'models/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('tests', ['pre-test'], function() {
  return gulp.src('test/*.test.coffee')
    .pipe(mocha())
    .on('error', function() {
      process.exit(1);
    })
    .on('exit', function() {
      process.exit();
    })
    .on('close', function() {
      process.exit(); // seems to fix the 'gulp no exiting' issue
      // using https://github.com/sindresorhus/gulp-mocha/issues/28
      done();
    });
    //.pipe(istanbul.writeReports({dir: 'test/coverage'}));
});

gulp.task('cover', ['tests'], function() {
  return gulp.src('test/coverage/**/lcov.info')
    .pipe(coveralls());
});
