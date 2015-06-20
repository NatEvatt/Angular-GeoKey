var gulp = require('gulp');
//var args = require('yargs').argv;
var config = require('./gulp.config')();
var port = process.env.PORT || config.defaultPort;
var $ = require('gulp-load-plugins')({
    lazy: true
});

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('wiredep', function () {
    log('wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        //.pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe($.replace('\/src\/client\/', ''))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep'], function () {
    log('wire up the stuff and stuff');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe($.replace(/="..\/..\/bower_components\//g, '="/bower_components/'))
        .pipe(gulp.dest(config.client));
});

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
