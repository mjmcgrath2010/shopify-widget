var gulp = require('gulp'),
    destLoc = './static/css/',
    scssLoc = './scss/**/*.scss',
    sass = require('gulp-sass');

// Run sass compiler once
gulp.task('sass', function () {
    var sass = require('gulp-sass');

    return gulp.src(scssLoc)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(destLoc));
});

// Watch sass for changes
gulp.task('sass:watch', function () {
  gulp.watch(scssLoc, ['sass']);
});

// Build distribution
gulp.task('dist', ['sass']);

// Default task
gulp.task('default', ['dist']);
