'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class Betting extends Base {

 constructor() {
 	super();
 }

 list(req, session, callback) {
  var roundNumber  = req['roundNumber'];

  var codigoSurvivor  = session['codigoSurvivor'];
  var correntRound  = session['correntRound'];
  var roundStatus   = session['roundStatus'];

  if (!codigoSurvivor)
    var codigoSurvivor  = session['codigoSurvivor'];

  if ((!roundStatus)&&(!roundNumber))
    var roundNumber = correntRound-1;

  if ((roundStatus)&&(!roundNumber))
    var roundNumber = correntRound;

  if ((roundNumber >= correntRound)&&(roundStatus))
    var roundNumber = correntRound-1;    

  Data.processaSql(
    Data.consulta({
      campos    :   'sp.codigoRodada, sp.codigoJogador, sj.nickname, st.nomeTime',
      tabelas   :   'sur_jogadores sj left outer join sur_palpites sp on sj.codigoJogador = sp.codigoJogador and sp.codigoRodada = ' + roundNumber + ' left join sur_times st on sp.codigoTime = st.codigoTime',
      condicoes :   'sj.codigoSurvivor = "' + codigoSurvivor + '"',
      ordenacao :   'nickName'
    }),
    function (res) {
      if ( res.lines ){
        var response = {}, list = [], i = 0;
        
        for (i = 0; i < res.lines; i++) { 
          var data = res.results[i];
          var time = data.nomeTime;
          var codigoRodada = data.codigoRodada

          if (!data.nomeTime)
            var time = ' - - - ';

          list.push({
            codigoRodada: data.codigoRodada,
            codigoJogador: data.codigoJogador,
            nome: data.nickname,
            time: time
          });
        }

        response = {
          betting: {
            round : codigoRodada,
            list : list
          },
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

module.exports = Betting;
