// gulpfile -- for Red Magic Systems_dev--
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var runSequence = require('run-sequence');
var du = require('date-utils');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var gutil = require( 'gulp-util' );

// Current Directory
var rootDir = ".";

// Start browserSync
gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./static"
        }
    });

    gulp.watch(['./**/*.css','./**/css/*.css','./**/*.html','./*.html']).on("change", reload);
});

// Compile LESS files from /less into /css
gulp.task('less', function() {
    var dt = new Date();
    var formatted = dt.toFormat("YYYY/MM/DD HH24:MI:SS");

    return gulp.src('./themes/@Style_Bootstarp_for_MT/bootstrap-3.3.7/less/bootstrap.less')
        .pipe(less())
        .pipe(replace(/__currenttime__/gm,formatted))
        .pipe(gulp.dest('./themes/@Style_Bootstarp_for_MT/bootstrap-3.3.7/dist/css'))
});

// Minify compiled CSS
gulp.task('minify-css', function() {
    return gulp.src('./themes/@Style_Bootstarp_for_MT/bootstrap-3.3.7/dist/css/bootstrap.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./themes/@Style_Bootstarp_for_MT/bootstrap-3.3.7/dist/css/'))
});

// Copy CSS to RedMagic_dev.
gulp.task('copy', function() {
    return gulp.src('./themes/@Style_Bootstarp_for_MT/bootstrap-3.3.7/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('_dev/css'));
});

// Copy CSS as template.
gulp.task('copytmpl', function() {
    return gulp.src('./themes/@Style_Bootstarp_for_MT/bootstrap-3.3.7/dist/css/bootstrap.min.css')
        .pipe(rename({basename: "bootstrap_min_css",extname: ".mtml"}))
        .pipe(gulp.dest('./themes/@Style_Bootstarp_for_MT/templates'));
});

// Sequence
gulp.task("run-sequence", function() {
    runSequence(
        "serve","less","minify-css",["copy","copytmpl"]
    );
});
// Run everything
gulp.task('default', ['serve','dev']);

// Dev task with browserSync
gulp.task('dev','', function() {
  gulp.watch('./themes/@Style_Bootstarp_for_MT/bootstrap-3.3.7/less/*.less', function() {
    runSequence(
      "less","minify-css",["copy","copytmpl"]
  );
});
});
