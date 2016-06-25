var express = require('express');
var app 	= express();
var env 	= require('node-env-file');
var async   = require('async');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var Base = require('./source/_components/index.js');
var Func = new Base();

var authentication = require('./source/services/authentication');
var map = require('./source/services/map');

env('./.env', { overwrite: true });

var port = process.env.SERVER_PORT || 80;

app.get('/', function(req, res) {
    res.send('survivor');
});

app.post('/authentication', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var auth = new authentication();

	auth.checkChannel(
		req.headers,
		function(ress){
			if (ress.lines) {
				auth.authentication(
					req.body,
					function(resss){
						if (resss.authentication) {
							res.cookie('service-session', String(resss.authentication.token), { httpOnly: true, maxAge: 60 * 60 * 24 * 1 });
						}
						res.send(resss);
					}
				);
			} else {
				res.send({ 
					reason: Func.invalidChannel()
				});
			}
		}
	);
});

app.get('/map', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var mp = new map();
	mp.checkSession(
		req.headers,
		function(ress){
			if (ress.lines) {
				mp.list(
					req.body, ress.results,
					function(resss){
						res.send(resss);
					}
				);
			} else {
				res.send({ 
					reason: Func.invalidSession()
				});
			}
		}
	);
});

app.listen(port, function() {
	console.log('Is running!!');
});

