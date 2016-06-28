'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class Map extends Base {

 constructor() {
 	super();
 }

 list(req, session, callback) {
  var roundNumber   = req['roundNumber'];
  var codigoJogador   = req['codigoJogador'];
  var codigoSurvivor  = req['codigoSurvivor'];

  if (!codigoJogador)
    var codigoJogador   = session['codigoJogador'];

  if (!codigoSurvivor)
    var codigoSurvivor  = session['codigoSurvivor'];

  var correntRound  = session['correntRound'];
  var roundStatus   = session['roundStatus'];

  Data.processaSql(
    Data.consulta({
      campos    :   'sm.codigoJogador, ' +
                    '(select nickname from sur_jogadores sj where sj.codigoSurvivor = sm.codigoSurvivor and sj.codigoJogador = sm.codigoJogador ) nickname, ' +
                    'sm.colocacao, sm.nmVidas, sm.nmVitorias, sm.nmEmpates, sm.nmDerrotas, sm.codigoTime, st.siglaTime, st.nomeTime, sm.resultado, sm.codigoRodada',
      tabelas   :   'sur_mapa sm, ( select * from sur_times st where codigoTime in (select codigoTimeA from sur_rodadas where codigoSurvivor = "' + codigoSurvivor + '") ) st ',
      condicoes :   'sm.codigoSurvivor = "' + codigoSurvivor + '" and sm.codigoJogador = "' + codigoJogador + '"' +
                    'and sm.codigoTime = st.codigoTime ',
      ordenacao :   '2, 10'
    }),
    function (res) {
      if ( res.lines ){
        var response = {}, list = [], classification = {}, i = 0;

        classification = {
          codigoJogador: res.results[0].codigoJogador,
              nickname: res.results[0].nickname,
              colocacao: res.results[0].colocacao,
              nmVidas: res.results[0].nmVidas,
              nmVitorias: res.results[0].nmVitorias,
              nmEmpates: res.results[0].nmEmpates,
              nmDerrotas: res.results[0].nmDerrotas
        }

        for (i = 0; i < res.lines; i++) { 
          list.push({
            codigoTime: res.results[i].codigoTime,
            siglaTime: res.results[i].siglaTime,
            nomeTime: res.results[i].nomeTime,
            resultado: res.results[i].resultado,
            codigoRodada: res.results[i].codigoRodada
          });
        }

        response = {
          map: {
            round : {
              correntRound: correntRound,
              roundStatus : roundStatus
            },
            classification: classification,
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

        var roundStatus = 0;
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

module.exports = Map;
