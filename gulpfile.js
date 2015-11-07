var gulp = require('gulp'),
    mocha = require('gulp-mocha');

gulp.task('tests', function() {
  return gulp.src('test/*.test.js')
    .pipe(mocha())
    .once('error', function() {
      process.exit(1);
    })
    .once('exit', function() {
      process.exit();
    });
});
