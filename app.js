var express = require('express');
var app 	= express();
var env 	= require('node-env-file');

var Authentication = require('./source/services/authentication');

env('./.env', { overwrite: true });

var port = process.env.SERVER_PORT || 80;

app.get('/', function(req, res) {
    res.send('survivor');
});

app.get('/authentication', function(req, res) {
	var auth = new Authentication();
	auth.destructor();
    res.send('authentication');
});

app.listen(port, function() {
	console.log('Is running!!');
});