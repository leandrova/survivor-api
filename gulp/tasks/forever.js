'use strict';

var gulp = require('gulp');
var forever = require('gulp-forever-monitor');
 
gulp.task('forever', function() {

  var foreverMonitorOptions = { 
    // env: process.env,
    // args: process.argv,
    watch: true,
    watchIgnorePatterns:  ['.*', 'node_modules/**', 'public/**', 'temp/**']
  }
  
  forever('./app/app.js', foreverMonitorOptions)  
  .on('watch:restart', function(fileInfo) { 
    console.log('server was restarted');          
  })
  .on('exit', function() {
    console.log('server was closed');
  })

})