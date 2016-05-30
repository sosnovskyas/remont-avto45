'use strict';

import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import del from 'del';
import jade from 'gulp-jade';
import browserSync from 'browser-sync'

const bsServer = browserSync.create();

const paths = {
  styles: {
    src: ['src/styles.scss', 'src/components/**/*.scss'],
    dest: 'dist/assets/'
  },
  serve: {
    dest: 'dist'
  },
  templates: {
    src: ['src/markup/*.jade'],
    watch: ['src/**/*.jade'],
    dest: 'dist/'
  }
};


const clean = () => del(['dist']);
export {clean};

export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(bsServer.stream())
}

export function templates() {
  const YOUR_LOCALS = {};

  return gulp.src(paths.templates.src)
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(paths.templates.dest))
    .pipe(bsServer.stream())
}

export function serve() {
  bsServer.init({
    server: {
      baseDir: paths.serve.dest
    }
  });
}


export function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
}

const build = gulp.series(clean, gulp.parallel(styles, templates), gulp.parallel(watch, serve));
export {build};

export default build;
