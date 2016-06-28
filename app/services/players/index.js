'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class Players extends Base {

 constructor() {
 	super();
 }

 list(req, session, callback) {

  var codigoSurvivor  = req['codigoSurvivor'];

  if (!codigoSurvivor)
    var codigoSurvivor  = session['codigoSurvivor'];

  Data.processaSql(
    Data.consulta({
      tabelas   :   'sur_jogadores',
      condicoes :   'codigoSurvivor = "' + codigoSurvivor + '"',
      ordenacao :   'nickName'
    }),
    function (res) {
      if ( res.lines ){
        var response = {}, list = [], i = 0;
        
        for (i = 0; i < res.lines; i++) { 
          var data = res.results[i];
          list.push({
            codigoJogador: data.codigoJogador,
            nome: data.nickname,
            codigoUsuario: data.codigoUsuario
          });
        }

        response = {
          players: list,
          reason: Func.reason(1, 0, 'Consulta realizada com sucesso.')
        }
      } else {
        response = {
          reason: Func.reason(0, 4000, 'Não foi possivel consultar os jogadores.')
        }
      }
      callback(response);
    }
  )
 }

 checkSession(header, callback) { 
  var session = header['service-session'];

  if (!session)
    session = Func.getCookie(header, 'service-session');

  Data.processaSql(
    Data.consulta({
      tabelas: 'sur_sessions',
      condicoes: 'token = "' + session + '" and ( horaChecked > "' + Func.time('m',-30) + '" or saveSession = 1 )'
    }),
    function (res){
      if (res.lines) {
        var data = res.results[0];
        var codigoUsuario = data.codigoUsuario;
        var codigoJogador = data.codigoJogador;
        var codigoSurvivor = data.codigoSurvivor;
        Data.processaSql(
          Data.altera({
            tabelas: 'sur_sessions',
            campos: ' horaChecked = "' + Func.time() + '" ',
            condicoes: 'token = "' + session + '" '
          }),
          function (ress){
            callback({
              lines: 1,
              results: {
                codigoSurvivor: codigoSurvivor,
                codigoJogador: codigoJogador,
                codigoUsuario: codigoUsuario
              }
            });
          }
        );
      } else {
        callback({
          lines: 0
        });
      }
    }
  );
 }
 
}

module.exports = Players;
