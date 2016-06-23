var express = require('express');
var app 	= express();
var env 	= require('node-env-file');
var async   = require('async');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var Base = require('./source/_components/index.js');
var Func = new Base();

var Authentication = require('./source/services/authentication');

env('./.env', { overwrite: true });

var port = process.env.SERVER_PORT || 80;

app.get('/', function(req, res) {
    res.send('survivor');
});

app.post('/authentication', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var auth = new Authentication();

	auth.checkChannel(
		req.headers,
		function(ress){
			if (ress.lines) {
				auth.authentication(
					req.body,
					function(resss){
						res.send(resss);
					}
				);
			} else {
				res.send({ 
					reason: Func.reason(0, 'Channel invalido.')
				});
			}
		}
	);
});

app.listen(port, function() {
	console.log('Is running!!');
});