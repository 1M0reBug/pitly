var gulp      = require('gulp'),
    mocha     = require('gulp-mocha'),
    // TODO: installing istanbul and coveralls
    istanbul  = require('gulp-istanbul'),
    coveralls = require('gulp-coveralls');

// TODO : using coffeescript for lighter syntax
gulp.task('pre-test', function(){
  return gulp.src(['app.js', 'routes/*.js', 'models/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('tests', ['pre-test'], function() {
  return gulp.src('test/*.test.js')
    .pipe(mocha())
    .pipe(istanbul.writeReports({dir: 'test/coverage'}))
    .once('error', function() {
      process.exit(1);
    }) // FIXME : why doesn't it exit when finished ?
    .once('exit', function() {
      process.exit();
    });
});

gulp.task('cover', ['tests'], function() {
  return gulp.src('test/coverage/**/lcov.info')
    .pipe(coveralls());
});
