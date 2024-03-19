const gulp = require('gulp');
const rename = require('gulp-rename');
const size = require('gulp-size');
const terser = require('gulp-terser');
const plumber = require('gulp-plumber');
const rollup = require('@rollup/stream');
const source = require('vinyl-source-stream');
const pkg = require('./package.json');

const headerComment = `/**
 * @preserve
 * Somber.js v${pkg.version}
 */`;

const onwarn = warning => {
  // Silence circular dependency warning
  if (warning.code === 'CIRCULAR_DEPENDENCY') {
    return;
  }

  console.warn(warning.message);
};

function buildIife() {
  return rollup({
    input: './src/somber.defaults.js',
    output: {
      format: 'iife',
      name: 'somber',
      strict: false,
      banner: headerComment
    },
    onwarn
  })
    .pipe(source('somber.js'))
    .pipe(gulp.dest('.'));
}

function buildModule() {
  return rollup({
    input: './src/somber.js',
    output: {
      format: 'es',
      strict: false,
      banner: headerComment
    },
    onwarn
  })
    .pipe(source('somber.mjs'))
    .pipe(gulp.dest('.'));
}

function distIife() {
  return gulp
    .src('somber.js')
    .pipe(plumber())
    .pipe(terser())
    .pipe(plumber.stop())
    .pipe(rename('somber.min.js'))
    .pipe(
      size({
        showFiles: true
      })
    )
    .pipe(
      size({
        showFiles: true,
        gzip: true
      })
    )
    .pipe(gulp.dest('.'));
}

function distModule() {
  return gulp
    .src('somber.mjs')
    .pipe(plumber())
    .pipe(terser())
    .pipe(plumber.stop())
    .pipe(rename('somber.min.mjs'))
    .pipe(
      size({
        showFiles: true
      })
    )
    .pipe(
      size({
        showFiles: true,
        gzip: true
      })
    )
    .pipe(gulp.dest('.'));
}

gulp.task('build', gulp.series(buildIife, buildModule));

gulp.task('dist', gulp.series('build', distIife, distModule));

gulp.task('watch', function () {
  gulp.watch('src/*.js', gulp.series('build', 'dist'));
});

gulp.task('default', gulp.series('build', 'watch'));
