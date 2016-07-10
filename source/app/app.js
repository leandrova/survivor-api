var express = require('express');
var app 	= express();
var env 	= require('node-env-file');
var fs   	= require('fs');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(req, res, next){
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'user, pass, saveSession, service-name, service-token, service-session, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header('Content-Type', 'application/json');
	next();
})

var Base = require('./_components/index.js');
var Func = new Base();

if ( fs.statSync('../.env').isFile() ) {
	env('../.env', { overwrite: true });
}

var port = process.env.SERVER_PORT || 80;

app.get('/', function(req, res) {
    res.send('survivor');
});

app.get('/authentication', function(req, res) {
	var authentication = require('./services/authentication');	
	var auth = new authentication();
	auth.auditing('authentication', 'start', req.body, req.headers);
	auth.checkChannel(
		req.headers,
		function(ress){
			auth.auditing('authentication', 'checkChannel', req.body, req.headers, ress);
			if (ress.lines) {
				auth.authentication(
					req.headers,
					function(resss){
						auth.auditing('authentication', 'authentication', req.body, req.headers, resss);
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
	var map = require('./services/map');
	var mp = new map();
	mp.auditing('map', 'start', req.body, req.headers);
	mp.checkSession(
		req.headers,
		function(ress){
			mp.auditing('map', 'checkSession', req.body, req.headers, ress);
			if (ress.lines) {
				mp.correntRound(
					req.body, ress.results,
					function(resss){
						mp.auditing('map', 'correntRound', req.body, req.headers, resss);
						mp.list(
							req.body, resss,
							function(ressss){
								mp.auditing('map', 'list', req.body, req.headers, ressss);
								res.send(ressss);
							}
						);
					}
				);
			} else {
				if (ress.reason.error){
					var response = ress.reason;
				} else {
					var response = Func.invalidSession();
				}
				res.send({ 
					reason: response
				});
			}
		}
	);
});

app.get('/rounds', function(req, res) {
	var rounds = require('./services/rounds');
	var round = new rounds();
	round.auditing('rounds', 'start', req.body, req.headers);
	round.checkSession(
		req.headers,
		function(ress){
			round.auditing('rounds', 'checkSession', req.body, req.headers, ress);
			if (ress.lines) {
				round.correntRound(
					req.body, ress.results,
					function(resss){
						round.auditing('rounds', 'correntRound', req.body, req.headers, resss);
						round.list(
							req.body, resss,
							function(ressss){
								round.auditing('rounds', 'list', req.body, req.headers, ressss);
								res.send(ressss);
							}
						);
					}
				);
			} else {
				if (ress.reason.error){
					var response = ress.reason;
				} else {
					var response = Func.invalidSession();
				}
				res.send({ 
					reason: response
				});
			}
		}
	);
});

app.post('/rounds/detail', function(req, res) {
	var rounds = require('./services/rounds/detail');
	var round = new rounds();
	round.auditing('rounds-detail', 'start', req.body, req.headers);
	round.checkSession(
		req.headers,
		function(ress){
			round.auditing('rounds-detail', 'checkSession', req.body, req.headers, ress);
			if (ress.lines) {
				round.correntRound(
					req.body, ress.results,
					function(resss){
						round.auditing('rounds-detail', 'correntRound', req.body, req.headers, resss);
						round.listDetail(
							req.body, resss,
							function(ressss){
								round.auditing('rounds-detail', 'listDetail', req.body, req.headers, ressss);
								res.send(ressss);
							}
						);
					}
				);
			} else {
				if (ress.reason.error){
					var response = ress.reason;
				} else {
					var response = Func.invalidSession();
				}
				res.send({ 
					reason: response
				});
			}
		}
	);
});

app.get('/classification', function(req, res) {
	var classification = require('./services/classification');
	var clas = new classification();
	clas.auditing('classification', 'start', req.body, req.headers);
	clas.checkSession(
		req.headers,
		function(ress){
			clas.auditing('classification', 'checkSession', req.body, req.headers, ress);
			if (ress.lines) {
				clas.correntRound(
					req.body, ress.results,
					function(resss){
						clas.auditing('classification', 'correntRound', req.body, req.headers, resss);
						clas.list(
							req.body, resss,
							function(ressss){
								clas.auditing('classification', 'list', req.body, req.headers, ressss);
								res.send(ressss);
							}
						);
					}
				);
			} else {
				if (ress.reason.error){
					var response = ress.reason;
				} else {
					var response = Func.invalidSession();
				}
				res.send({ 
					reason: response
				});
			}
		}
	);

});

app.get('/players', function(req, res) {
	var players = require('./services/players');
	var play = new players();
	play.auditing('players', 'start', req.body, req.headers);
	play.checkSession(
		req.headers,
		function(ress){
			play.auditing('players', 'checkSession', req.body, req.headers, ress);
			if (ress.lines) {
				play.list(
					req.body, ress.results,
					function(resss){
						play.auditing('players', 'play', req.body, req.headers, resss);
						res.send(resss);
					}
				);
			} else {
				if (ress.reason.error){
					var response = ress.reason;
				} else {
					var response = Func.invalidSession();
				}
				res.send({ 
					reason: response
				});
			}
		}
	);

});

app.post('/betting', function(req, res) {
	var betting = require('./services/betting/list');
	var bet = new betting();
	bet.auditing('betting', 'start', req.body, req.headers);
	bet.checkSession(
		req.headers,
		function(ress){
			bet.auditing('betting', 'checkSession', req.body, req.headers, ress);
			if (ress.lines) {
				bet.correntRound(
					req.body, ress.results,
					function(resss){
						bet.auditing('betting', 'correntRound', req.body, req.headers, resss);
						bet.list(
							req.body, resss,
							function(ressss){
								bet.auditing('betting', 'correntRound', req.body, req.headers, ressss);
								res.send(ressss);
							}
						);
					}
				);
			} else {
				if (ress.reason.error){
					var response = ress.reason;
				} else {
					var response = Func.invalidSession();
				}
				res.send({ 
					reason: response
				});
			}
		}
	);

});

app.post('/betting/bet', function(req, res) {
	var betting = require('./services/betting/bet');
	var bet = new betting();
	bet.auditing('bet', 'start', req.body, req.headers);
	bet.checkSession(
		req.headers,
		function(ress){
			bet.auditing('bet', 'checkSession', req.body, req.headers, ress);
			if (ress.lines) {
				bet.correntRound(
					req.body, ress.results,
					function(resss){
						bet.auditing('bet', 'correntRound', req.body, req.headers, resss);
						bet.bet(
							req.body, resss,
							function(ressss){
								bet.auditing('bet', 'bet', req.body, req.headers, ressss);
								res.send(ressss);
							}
						);
					}
				);
			} else {
				if (ress.reason.error){
					var response = ress.reason;
				} else {
					var response = Func.invalidSession();
				}
				res.send({ 
					reason: response
				});
			}
		}
	);

});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "localhost";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress, function() {
    console.log('Is running')
});
