var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var cleanCss = require('gulp-clean-css')

gulp.task('clean', function () {
  console.log('aa')
})

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
  ]).pipe(concat('bundle.js')).pipe(uglify()).pipe(gulp.dest('./'))
})

gulp.task('pack-css', function () {
  return gulp.src([
    'https://fonts.googleapis.com/css?family=Fredoka+One',
    './fonts/map-icons/css/map-icons.css',
    './fonts/icomoon/style.css',
    './js/plugins/jquery.bxslider/jquery.bxslider.css',
    './js/plugins/jquery.customscroll/jquery.mCustomScrollbar.min.css',
    './js/plugins/jquery.mediaelement/mediaelementplayer.min.css',
    './js/plugins/jquery.owlcarousel/owl.carousel.css',
    './js/plugins/jquery.owlcarousel/owl.theme.css',
    './style.css',
    './colors/green.css',
  ]).pipe(concat('bundle.css')).pipe(cleanCss()).pipe(gulp.dest('./'))
})

gulp.task('default', gulp.parallel('pack-js', 'pack-css'))