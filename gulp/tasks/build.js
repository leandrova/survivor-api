'use strict';

var gulp = require('gulp'),
    fileinclude = require('gulp-file-include');

gulp.task('build', ['app', 'store', 'components'], function() {
  	return;
});

gulp.task('app', function() {
    gulp.src('./source/app/**/*.*')
    	.pipe(fileinclude({}))
    	.pipe(gulp.dest('./app'));
  	return;
});

gulp.task('store', function() {
    gulp.src('./source/_store/**/*.*')
    	.pipe(fileinclude({}))
    	.pipe(gulp.dest('./app/_store'));
  	return;
});

gulp.task('components', function() {
    gulp.src('./source/_components/**/*.*')
    	.pipe(fileinclude({}))
    	.pipe(gulp.dest('./app/_components'));
  	return;
});

