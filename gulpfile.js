var gulp = require('gulp'),
    mocha = require('gulp-mocha');

gulp.task('tests', function() {
  return gulp.src('test/*.test.js')
    .pipe(mocha());
})
