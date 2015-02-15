var pkg = require('./package.json'),
    karma = require('karma').server,
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    eslint = require('gulp-eslint'),
    fs = require('fs'),
    del = require('del');

gulp.task('clean', ['lint'], function (cb) {
    del(['dist'], cb);
});

gulp.task('lint', function () {
    return gulp
        .src(['./src/*.js', './src/tests/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('distribute', ['clean'], function (cb) {
    var bower = require('./bower.json');

    gulp
        .src('./src/wholly.js')
        .pipe(header('/**\n* @version <%= version %>\n* @link https://github.com/gajus/wholly for the canonical source repository\n* @license https://github.com/gajus/wholly/blob/master/LICENSE BSD 3-Clause\n*/\n', {version: pkg.version}))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('wholly.min.js'))
        .pipe(header('/**\n* @version <%= version %>\n* @link https://github.com/gajus/wholly for the canonical source repository\n* @license https://github.com/gajus/wholly/blob/master/LICENSE BSD 3-Clause\n*/\n', {version: pkg.version}))
        .pipe(gulp.dest('./dist/'))
        .on('error', gutil.log);

    bower.name = pkg.name;
    bower.description = pkg.description;
    bower.version = pkg.version;
    bower.keywords = pkg.keywords;

    fs.writeFile('./bower.json', JSON.stringify(bower, null, 4), cb);
});

gulp.task('travis', ['default'], function (cb) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, cb);
});

gulp.task('watch', function () {
    gulp.watch('./src/wholly.js', ['default']);
});

gulp.task('default', ['distribute']);
