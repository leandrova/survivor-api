'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class Rounds extends Base {

 constructor() {
 	super();
 }

 list(req, session, callback) {

  var roundNumber = session['correntRound'];
  var codigoSurvivor  = req['codigoSurvivor'];

  if (!codigoSurvivor)
    var codigoSurvivor  = session['codigoSurvivor'];

  Data.processaSql(
    Data.consulta({
      campos    : 'codigoRodada',
      tabelas   : 'sur_rodadas',
      condicoes : 'codigoSurvivor = "' + codigoSurvivor + '"',
      agrupamento : 'codigoRodada',
      ordenacao : 'codigoRodada'
    }),
    function (res) {
      if ( res.lines ) {
        var response = {}, list = [], classification = {}, i = 0;

        for (i = 0; i < res.lines; i++) { 
          list.push({
            codigoRodada: res.results[i].codigoRodada
          });
        }

        response = {
          round: {
            correntRound: roundNumber,
            list: list
          },
          reason: Func.reason(1, 0, 'Consulta realizada com sucesso.')
        }
      } else {
        response = {
          reason: Func.reason(0, 4000, 'Não foi possivel consultar o mapa solicitado.')
        }
      }
      callback(response);
    }
  )
 }

 correntRound(req, session, callback) {
  var codigoSurvivor  = session['codigoSurvivor'];
  var codigoJogador   = session['codigoJogador'];
  var codigoUsuario   = session['codigoUsuario'];

  var hojeData        = Func.date();
  var horaFech        = Func.time('h', -180);

  Data.processaSql(
    Data.consulta({
      tabelas   : 'sur_rodadas',
      condicoes : 'codigoSurvivor = "' + codigoSurvivor + '" and placarTimeA is null',
      ordenacao : 'codigoRodada, dataJogo, horaJogo',
      limite    : '1'
    }),
    function (res) {
      if (res.lines) {
        var data = res.results[0];

        var roundStatus = 1;
        if ( Func.dataInterna(data.dataJogo) > hojeData ){
          var roundStatus = 1;
        } else if ( Func.dataInterna(data.dataJogo) == hojeData ) {
          if ( horaFech < data.horaJogo) {
            var roundStatus = 1;
          }
        }
        
        callback({
          correntRound : data.codigoRodada,
          roundStatus : roundStatus,
          codigoSurvivor : codigoSurvivor,
          codigoJogador : codigoJogador,
          codigoUsuario : codigoUsuario
        });
      }
       else {
        Data.processaSql(
        Data.consulta({
          tabelas   : 'sur_rodadas',
          condicoes : 'codigoSurvivor = "' + codigoSurvivor + '"',
          ordenacao : 'codigoRodada desc',
          limite    : '1'
        }),
          function (ress) {
            console.log('=> ', ress);
            if (ress.lines) {
              var data = ress.results[0];
              var response = {
                correntRound : data.codigoRodada,
                roundStatus : 0,
                codigoSurvivor : codigoSurvivor,
                codigoJogador : codigoJogador,
                codigoUsuario : codigoUsuario
              };
            } else {
              var response = {
                correntRound : null,
                roundStatus : 0,
                codigoSurvivor : codigoSurvivor,
                codigoJogador : codigoJogador,
                codigoUsuario : codigoUsuario
              };
            }
            callback(response);
          }
        );
      }
    }
  );
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

module.exports = Rounds;
