var pkg = require('./package.json'),
    karma = require('karma').server,
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    del = require('del');

gulp.task('clean', function (cb) {
    del(['dist'], cb);
});

gulp.task('test', ['minify'], function (cb) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, cb);
});

gulp.task('travis', ['clean', 'test']);

gulp.task('version', function () {
    // @todo
    // Update jQuery/bower json
    // version and dependencies
});

gulp.task('minify', function () {
    return gulp
        .src('./src/wholly.js')
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('wholly.min.js'))
        .pipe(header('/**\n* @version <%= pkg.version %>\n* @link https://github.com/gajus/wholly for the canonical source repository\n* @license https://github.com/gajus/wholly/blob/master/LICENSE BSD 3-Clause\n*/\n', {pkg: pkg}))
        .pipe(gulp.dest('./dist/'))
        .on('error', gutil.log);
});

gulp.task('default');