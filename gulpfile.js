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
var ftp = require( 'vinyl-ftp' );

// Current Directory
var rootDir = ".";

// FTP Condition
var ftpCondition =  {
  host:     '203.137.183.89',
  port: 21,
  user:     '4kbnx627',
  password: '6#.gyTGF',
  maxConnections: 1,
  parallel: 1,
  secure: true ,
  secureOptions: { rejectUnauthorized: false },
  log:      gutil.log
};

// Start browserSync
gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "."
        }
    });

    gulp.watch(['./~hosomi/**/*.css','./~hosomi/**/css/*.css','./~hosomi/**/*.html','./~hosomi/*.html']).on("change", reload);
});

// Compile LESS files from /less into /css
gulp.task('less', function() {
    var dt = new Date();
    var formatted = dt.toFormat("YYYY/MM/DD HH24:MI:SS");

    return gulp.src('../tapioca-puda.movabletype.biz/themes/theme_hosomi/less/mystyle.less')
        .pipe(less())
        .pipe(replace(/__currenttime__/gm,formatted))
        .pipe(gulp.dest('../tapioca-puda.movabletype.biz/themes/theme_hosomi/dist/css'))
});

// Minify compiled CSS
gulp.task('minify-css', function() {
    return gulp.src('../tapioca-puda.movabletype.biz/themes/theme_hosomi/dist/css/mystyle.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('../tapioca-puda.movabletype.biz/themes/theme_hosomi/dist/css'))
});

// Copy CSS to portofolio.
gulp.task('copy', function() {
    return gulp.src('../tapioca-puda.movabletype.biz/themes/theme_hosomi/dist/css/mystyle.min.css')
        .pipe(gulp.dest('~hosomi/css'));
});

// Copy CSS as template.
gulp.task('copytmpl', function() {
    return gulp.src('../tapioca-puda.movabletype.biz/themes/theme_hosomi/dist/css/mystyle.min.css')
        .pipe(rename({basename: "mystyle_min",extname: ".mtml"}))
        .pipe(gulp.dest('../tapioca-puda.movabletype.biz/themes/theme_hosomi/templates'));
});

// Upload Templates
gulp.task( 'ftp', function () {

    var conn = ftp.create(ftpCondition);
    var globs = [
         '../tapioca-puda.movabletype.biz/themes/theme_hosomi/templates/**.mtml'
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, { base: '', buffer: false } )
        // .pipe(conn.newer('/themes/theme_hosomi/templates/')); // only upload newer files
        .pipe( conn.dest( 'themes/theme_from_hosomi_2/templates/' ) );
} );

// Upload CSS
gulp.task( 'ftpcss', function () {

  var conn = ftp.create(ftpCondition);

    var globsCss = [
         '~hosomi/css/mystyle.min.css'
    ];
    return gulp.src( globsCss, { base: '.', buffer: false })
        .pipe( conn.dest( '/static/' ) );
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
  gulp.watch('../tapioca-puda.movabletype.biz/themes/theme_hosomi/less/*.less', function() {
    runSequence(
      "less","minify-css",["copy","copytmpl"]
  );
});
  // gulp.watch('../themes/theme_hosomi/templates/**.mtml', 'ftp');
  // gulp.watch('portofolio/css/mystyle.min.css', 'ftpcss');
});
