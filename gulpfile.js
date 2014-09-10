var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    del = require('del');

//Static Server    
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './app'
        }
    });
});

// Styles
gulp.task('styles', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('app/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('app/styles'))
    .pipe(reload({stream:true}));
});
 
// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('app/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('app/scripts'))
    .pipe(reload({stream:true}));
});
 
// Images
gulp.task('images', function() {
  return gulp.src('src/images/*')
    .pipe(cache(imagemin({ optimizationLevel: 0, progressive: true, interlaced: true })))
    .pipe(gulp.dest('app/images'))
    .pipe(reload({stream:true}));
});

// HTML
gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('app'))
    .pipe(reload({stream:true}));
});
 
// Clean
gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});
 
// Watch
gulp.task('watch', function() {
 
  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);
 
  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);
 
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Watch index.html
  gulp.watch('src/index.html', ['html']);
  // Watch any files in app/, reload on change
  gulp.watch(['app/**']).on('change', browserSync.reload);
 
});

// Default task
gulp.task('default', ['clean', 'browser-sync'], function() {
    gulp.start('styles', 'scripts', 'images','watch');
    
});

