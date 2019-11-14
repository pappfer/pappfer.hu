var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var cleanCss = require('gulp-clean-css')
var rev = require('gulp-rev')
var del = require('del');
var git = require('gulp-git');

// remove old build files
gulp.task('clean', function () {
  return del([
    'build/*'
  ]);
});

// concatenate and minify JavaScript files
gulp.task('pack-js', function () {
  return gulp.src([
    './js/plugins/jquery.mousewheel-3.0.6.pack.js',
    './js/plugins/imagesloaded.pkgd.min.js',
    './js/plugins/jquery.appear.min.js',
    './js/plugins/jquery.onepagenav.min.js',
    './js/plugins/jquery.bxslider/jquery.bxslider.min.js',
    './js/plugins/jquery.customscroll/jquery.mCustomScrollbar.concat.min.js',
    './js/plugins/jquery.owlcarousel/owl.carousel.min.js',
    './js/options.js',
    './js/site.js',
  ]).pipe(concat('bundle.js'))
  .pipe(uglify())
  .pipe(rev())
  .pipe(gulp.dest('build/js'))
  .pipe(rev.manifest('build/rev-manifest.json', {
    merge: true
  }))
  .pipe(gulp.dest('./'))
})

// concatenate and minify CSS files
gulp.task('pack-css', function () {
  return gulp.src([
    './fonts/map-icons/css/map-icons.css',
    './fonts/icomoon/style.css',
    './js/plugins/jquery.bxslider/jquery.bxslider.css',
    './js/plugins/jquery.customscroll/jquery.mCustomScrollbar.min.css',
    './js/plugins/jquery.mediaelement/mediaelementplayer.min.css',
    './js/plugins/jquery.owlcarousel/owl.carousel.css',
    './js/plugins/jquery.owlcarousel/owl.theme.css',
    './style.css',
    './colors/green.css',
  ]).pipe(concat('bundle.css'))
  .pipe(cleanCss())
  .pipe(rev())
  .pipe(gulp.dest('build/css'))
  .pipe(rev.manifest('build/rev-manifest.json', {
    merge: true
  }))
  .pipe(gulp.dest('./'))
})

gulp.task('git-add', function(){
  return gulp.src('./build/*')
  .pipe(git.add());
});

// run the above tasks after each other
gulp.task('default', gulp.series('clean', 'pack-js', 'pack-css', 'git-add'))