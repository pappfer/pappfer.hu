const gulp = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const cleanCss = require('gulp-clean-css')
const rev = require('gulp-rev')
const del = require('del');
const git = require('gulp-git');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');

// remove old build files
gulp.task('clean', function () {
  return del([
    'build/*'
  ]);
});

// concatenate and minify JavaScript files
gulp.task('pack-js', function () {
  return gulp.src([
    './public/js/jquery.min.js',
    './public/js/plugins/jquery.mousewheel-3.0.6.pack.js',
    './public/js/plugins/imagesloaded.pkgd.min.js',
    './public/js/plugins/jquery.appear.min.js',
    './public/js/plugins/jquery.onepagenav.min.js',
    './public/js/plugins/jquery.bxslider/jquery.bxslider.min.js',
    './public/js/plugins/jquery.customscroll/jquery.mCustomScrollbar.concat.min.js',
    './public/js/plugins/jquery.owlcarousel/owl.carousel.min.js',
    './public/js/options.js',
    './public/js/site.js',
  ]).pipe(concat('bundle.js'))
  .pipe(uglify())
  .pipe(rev())
  .pipe(gulp.dest('./public/build/js'))
  .pipe(rev.manifest('./public/build/rev-manifest.json', {
    merge: true
  }))
  .pipe(gulp.dest('./'))
})

// concatenate and minify CSS files
gulp.task('pack-css', function () {
  return gulp.src([
    //'./public/fonts/fonts.css',
    './public/fonts/map-icons/css/map-icons.css',
    './public/fonts/icomoon/style.css',
    './public/js/plugins/jquery.bxslider/jquery.bxslider.css',
    './public/js/plugins/jquery.customscroll/jquery.mCustomScrollbar.min.css',
    './public/js/plugins/jquery.mediaelement/mediaelementplayer.min.css',
    './public/js/plugins/jquery.owlcarousel/owl.carousel.css',
    './public/js/plugins/jquery.owlcarousel/owl.theme.css',
    './public/css/style.css',
    './public/css/colors/green.css',
  ]).pipe(concat('bundle.css'))
  .pipe(cleanCss())
  .pipe(rev())
  .pipe(gulp.dest('./public/build/css'))
  .pipe(rev.manifest('./public/build/rev-manifest.json', {
    merge: true
  }))
  .pipe(gulp.dest('./'))
})

// compress the images to save space
gulp.task('optimize-images', function(){
  return gulp.src('./public/img/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('./public/img'))
});

// minify HTML (it does not touch PHP code)
gulp.task('minify-html', () => {
  return gulp.src('./public/index-dev.php')
  .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, minifyJS: true }))
  .pipe(rename({
    basename: 'index'
  }))
  .pipe(gulp.dest('./public'));
});

// add the newly created bundle files to Git
gulp.task('git-add', function(){
  return gulp.src('./public/build/*')
  .pipe(git.add());
});

// run the above tasks after each other
gulp.task('default', gulp.series('clean', 'pack-js', 'pack-css', 'optimize-images', 'minify-html', 'git-add'))