'use strict';

var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    ftp   = require('vinyl-ftp'),
    env   = require('node-env-file'),
    fs    = require('fs'),
    tpFls = [ './app/**/*' ];

if ( fs.statSync('./.host').isFile() ) {
    env('./.host', { overwrite: true });
}

var host = process.env.FTP_HOST,
    user = process.env.FTP_USER,
    pwd  = process.env.FTP_PWD,
    rLoc = process.env.FTP_REMOTE_LOCATION;

function getFtpConnection(){
    return ftp.create({
        host: host,
        port: 21,
        user: user,
        password: pwd,
        parallel: 5,
        log: gutil.log
    })
}

gulp.task('transfer',function(){
    var conn = getFtpConnection();
    return gulp.src(tpFls, {base: '.', buffer: false})
        .pipe(conn.dest(rLoc))
})