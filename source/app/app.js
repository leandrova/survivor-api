var express = require('express');
var app 	= express();
var env 	= require('node-env-file');
var async   = require('async');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(req, res, next){
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'service-name, service-token, service-session, Content-Type');
	res.header('Content-Type', 'application/json');
	next();
})

var Base = require('./_components/index.js');
var Func = new Base();

env('../.env', { overwrite: true });

var port = process.env.SERVER_PORT || 80;

app.get('/', function(req, res) {
    res.send('survivor');
});

app.post('/authentication', function(req, res) {
	console.log('=========== Auth ===========')
	var authentication = require('./services/authentication');	
	var auth = new authentication();
	auth.checkChannel(
		req.headers,
		function(ress){
			console.log('====');
			console.log('checkChannel', req.headers);
			console.log('Result', ress);
			if (ress.lines) {
				auth.authentication(
					req.body,
					function(resss){
						console.log('====');
						console.log('authentication', req.body);
						console.log('Result', resss);
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
	console.log('=========== MAP ===========')
	res.setHeader('Content-Type', 'application/json');
	var map = require('./services/map');
	var mp = new map();
	mp.checkSession(
		req.headers,
		function(ress){
			console.log('====');
			console.log('checkSession', req.headers);
			console.log('Result', ress);
			if (ress.lines) {
				mp.correntRound(
					req.body, ress.results,
					function(resss){
						console.log('====');
						console.log('correntRound', req.body);
						console.log('Result', resss);
						mp.list(
							req.body, resss,
							function(ressss){
								console.log('====');
								console.log('list', req.body);
								console.log('Result', ressss);
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
	console.log('=========== Rounds ===========')
	res.setHeader('Content-Type', 'application/json');
	var rounds = require('./services/rounds');
	var round = new rounds();
	round.checkSession(
		req.headers,
		function(ress){
			console.log('====');
			console.log('checkSession', req.headers);
			console.log('Result', ress);
			if (ress.lines) {
				round.correntRound(
					req.body, ress.results,
					function(resss){
						console.log('====');
						console.log('correntRound', req.body);
						console.log('Result', resss);
						round.list(
							req.body, resss,
							function(ressss){
								console.log('====');
								console.log('list', req.body);
								console.log('Result', ressss);
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
	console.log('=========== Rounds Detail ===========');
	res.setHeader('Content-Type', 'application/json');
	var rounds = require('./services/rounds/detail');
	var round = new rounds();
	round.checkSession(
		req.headers,
		function(ress){
			console.log('====');
			console.log('checkSession', req.headers);
			console.log('Result', ress);
			if (ress.lines) {
				round.correntRound(
					req.body, ress.results,
					function(resss){
						console.log('====');
						console.log('correntRound', req.body);
						console.log('Result', resss);
						round.listDetail(
							req.body, resss,
							function(ressss){
								console.log('====');
								console.log('listDetail', req.body);
								console.log('Result', ressss);
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
	console.log('=========== Classification ===========');
	res.setHeader('Content-Type', 'application/json');
	var classification = require('./services/classification');
	var clas = new classification();
	clas.checkSession(
		req.headers,
		function(ress){
			console.log('====');
			console.log('checkSession', req.headers);
			console.log('Result', ress);
			if (ress.lines) {
				clas.correntRound(
					req.body, ress.results,
					function(resss){
						console.log('====');
						console.log('correntRound', req.body);
						console.log('Result', resss);
						clas.list(
							req.body, resss,
							function(ressss){
								console.log('====');
								console.log('list', req.body);
								console.log('Result', ressss);
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
	console.log('=========== Players ===========');
	res.setHeader('Content-Type', 'application/json');
	var players = require('./services/players');
	var play = new players();
	play.checkSession(
		req.headers,
		function(ress){
			console.log('====');
			console.log('checkSession', req.headers);
			console.log('Result', ress);
			if (ress.lines) {
				play.list(
					req.body, ress.results,
					function(resss){
						console.log('====');
						console.log('list', req.body);
						console.log('Result', resss);
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
	console.log('=========== Betting ===========');
	res.setHeader('Content-Type', 'application/json');
	var betting = require('./services/betting/list');
	var bet = new betting();
	bet.checkSession(
		req.headers,
		function(ress){
			console.log('====');
			console.log('checkSession', req.headers);
			console.log('Result', ress);
			if (ress.lines) {
				bet.correntRound(
					req.body, ress.results,
					function(resss){
						console.log('====');
						console.log('correntRound', req.body);
						console.log('Result', resss);
						bet.list(
							req.body, resss,
							function(ressss){
								console.log('====');
								console.log('list', req.body);
								console.log('Result', ressss);
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
	console.log('=========== Betting Bet ===========');
	res.setHeader('Content-Type', 'application/json');
	var betting = require('./services/betting/bet');
	var bet = new betting();
	bet.checkSession(
		req.headers,
		function(ress){
			console.log('====');
			console.log('checkSession', req.headers);
			console.log('Result', ress);
			if (ress.lines) {
				bet.correntRound(
					req.body, ress.results,
					function(resss){
						console.log('====');
						console.log('correntRound', req.body);
						console.log('Result', resss);
						bet.bet(
							req.body, resss,
							function(ressss){
								console.log('====');
								console.log('bet', req.body);
								console.log('Result', ressss);
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

