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
			tabelas: 'usuarios',
			condicoes: 'nome = "' + user + '" and senha = "' + pass + '"'
		}),
		function (res){
			if (res.lines){
				/**/
				var token = Func.tokenGeneration();
				Data.processaSql(
					Data.cadastro({
					tabelas: 'sur_sessions',
					campos: ' codigoUsuario, token, dataCadastro, horaCadastro',
					values: ' "' + (res.results[0]).codigoUsuario + '", "' + token + '", "' + Func.date() + '", "' + Func.time() + '" '
					}),
					function (ress){
						if ( ress.results.affectedRows ){
							var response = {
								authentication: { 
									token: token
								},
								reason: Func.reason(1, 'Usuario identificado com sucesso.')
							}
						} else {
							var response = {
								reason: Func.reason(0, 'Não foi possivel criar a sessão para o usuário. Tente novamente..')
							}
						}
						callback(response);
					}
				);
				/**/
			} else {
				var response = {
					reason: Func.reason(0, 'Ops! Não conseguimos identificar o usuário informado.')
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