'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class Authentication extends Base {

 constructor() {
 	super();
 }

 authentication(req, callback) {
	var user = req['user'];
 	var pass = req['pass'];

 	Data.processaSql(
		Data.consulta({
			campos		: ' us.codigoUsuario, sj.codigoJogador, sj.codigoSurvivor ',
			tabelas		: ' usuarios us, sur_jogadores sj ',
			condicoes	: ' us.email = "' + user + '" and us.senha = "' + pass + '" and us.codigoUsuario = sj.codigoUsuario ',
			ordenacao	: ' sj.codigoSurvivor desc ',
			limite		: 1
		}),
		function (res) {
			if (res.lines) {
				/**/
				var token = Func.tokenGeneration();
				var codigoUsuario = (res.results[0]).codigoUsuario;
				var codigoJogador = (res.results[0]).codigoJogador;
				var codigoSurvivor = (res.results[0]).codigoSurvivor;
				Data.processaSql(
					Data.cadastro({
					tabelas: 'sur_sessions',
					campos: ' codigoUsuario, token, dataCadastro, horaCadastro, horaChecked, codigoJogador, codigoSurvivor ',
					values: ' "' + codigoUsuario + '", "' + token + '", "' + Func.date() + '", "' + Func.time() + '", "' + Func.time() + '", "' + codigoJogador + '", "' + codigoSurvivor + '" '
					}),
					function (ress) {
						if (ress.results.affectedRows) {
							var response = {
								authentication: { 
									token: token
								},
								reason: Func.reason(1, 0, 'Usuario identificado com sucesso.')
							}
						} else {
							var response = {
								reason: Func.reason(0, 3100, 'Não foi possivel criar a sessão para o usuário. Tente novamente..')
							}
						}
						callback(response);
					}
				);
				/**/
			} else {
				var response = {
					reason: Func.reason(0, 2000, 'Ops! Não conseguimos identificar o usuário informado.')
				}
				callback(response);
			}
		}
	)
 }

 checkChannel(header, callback) { 
	var host = header['host'];
	var name = header['service-name'];
	var token = header['service-token'];
	Data.processaSql(
		Data.consulta({
			tabelas: 'sur_channels',
			condicoes: 'host = "' + host + '" and name = "' + name + '" and token = "' + token + '"'
		}),
    	function (response){
			callback(response);
		}
	);
 }
 
}

module.exports = Authentication;
