var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    shell = require('gulp-shell'),
    destLoc = './static/',
    scssLoc = './scss/**/*.scss';

// CSS
gulp.task('sass', function () {
    var sass = require('gulp-sass');

    return gulp.src(scssLoc)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(destLoc));
});

// CSS (watch)
gulp.task('sass-watch', shell.task([
    'sass --watch scss/widget.scss:static/css/widget.css'
]));

// Build distribution
gulp.task('dist', ['sass']);

// Default task
gulp.task('default', ['dist']);
