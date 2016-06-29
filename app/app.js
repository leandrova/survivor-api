var express = require('express');
var app 	= express();
var env 	= require('node-env-file');
var async   = require('async');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var Base = require('./_components/index.js');
var Func = new Base();

env('../.env', { overwrite: true });

var port = process.env.SERVER_PORT || 80;

app.get('/', function(req, res) {
    res.send('survivor');
});

app.post('/authentication', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var authentication = require('./services/authentication');	

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

	var map = require('./services/map');
	var mp = new map();

	mp.checkSession(
		req.headers,
		function(ress){
			if (ress.lines) {
				mp.correntRound(
					req.body, ress.results,
					function(resss){
						mp.list(
							req.body, resss,
							function(ressss){
								res.send(ressss);
							}
						);
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

app.get('/rounds', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var rounds = require('./services/rounds');
	var round = new rounds();

	round.checkSession(
		req.headers,
		function(ress){
			if (ress.lines) {
				round.correntRound(
					req.body, ress.results,
					function(resss){
						round.list(
							req.body, resss,
							function(ressss){
								res.send(ressss);
							}
						);
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

app.post('/rounds/detail', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var rounds = require('./services/rounds/detail');
	var round = new rounds();

	round.checkSession(
		req.headers,
		function(ress){
			if (ress.lines) {
				round.correntRound(
					req.body, ress.results,
					function(resss){
						round.listDetail(
							req.body, resss,
							function(ressss){
								res.send(ressss);
							}
						);
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

app.get('/classification', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var classification = require('./services/classification');
	var clas = new classification();

	clas.checkSession(
		req.headers,
		function(ress){
			if (ress.lines) {
				clas.correntRound(
					req.body, ress.results,
					function(resss){
						clas.list(
							req.body, resss,
							function(ressss){
								res.send(ressss);
							}
						);
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

app.get('/players', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var players = require('./services/players');
	var play = new players();

	play.checkSession(
		req.headers,
		function(ress){
			if (ress.lines) {
				play.list(
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

app.post('/betting', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var betting = require('./services/betting/list');
	var bet = new betting();

	bet.checkSession(
		req.headers,
		function(ress){
			if (ress.lines) {
				bet.correntRound(
					req.body, ress.results,
					function(resss){
						bet.list(
							req.body, resss,
							function(ressss){
								res.send(ressss);
							}
						);
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

app.post('/betting/bet', function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var betting = require('./services/betting/bet');
	var bet = new betting();

	bet.checkSession(
		req.headers,
		function(ress){
			if (ress.lines) {
				bet.correntRound(
					req.body, ress.results,
					function(resss){
						bet.bet(
							req.body, resss,
							function(ressss){
								res.send(ressss);
							}
						);
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

