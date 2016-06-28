'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class Classification extends Base {

 constructor() {
 	super();
 }

 list(req, session, callback) {

  var codigoSurvivor  = req['codigoSurvivor'];
  var roundNumber     = req['roundNumber'];
  var roundStatus     = session['roundStatus'];

  if (!roundNumber)
    var roundNumber = session['correntRound'];

  if (!codigoSurvivor)
    var codigoSurvivor  = session['codigoSurvivor'];

  Data.processaSql(
    Data.consulta({
      campos    : 'sc.codigoSurvivor, colocacao, sc.codigoRodada, nickName, (ss.nmVidas-nmDerrotas) as nmVidas, nmVitorias, nmEmpates, nmDerrotas ',
      tabelas   : 'sur_classificacao sc   left join sur_jogadores sj on sc.codigoSurvivor = sj.codigoSurvivor and sc.codigoJogador = sj.codigoJogador left join sur_survivor ss on sc.codigoSurvivor = ss.codigoSurvivor ',
      condicoes : 'sc.codigoSurvivor = "' + codigoSurvivor + '" and sc.codigoRodada = (select codigoRodada from sur_classificacao where codigoSurvivor = "5" and codigoRodada in (' + (roundNumber-1) + ',' + roundNumber + ') group by codigoSurvivor, codigoRodada limit 1) ',
      ordenacao : 'codigoRodada, colocacao, (ss.nmVidas-nmDerrotas), nmVitorias desc, nmEmpates, nmDerrotas, nickName '
    }),
    function (res) {
      if ( res.lines ){
        var response = {}, list = [], classification = {}, i = 0, nmVidas = 0;
        var colocacao = '', nmVidas = '', nmVitorias = '', nmEmpates = '', nmDerrotas = '', codigoRodada = '';

        for (i = 0; i < res.lines; i++) { 
          var data = res.results[i];

          if (data.nmVidas == nmVidas & data.nmVitorias == nmVitorias & data.nmEmpates == nmEmpates & data.nmDerrotas == nmDerrotas) {
            colocacao = colocacaoAnterior;
          } else {
            var colocacaoAnterior = data.colocacao;
            var colocacao = data.colocacao;
            var nmVidas = data.nmVidas;
            var nmVitorias = data.nmVitorias;
            var nmEmpates = data.nmEmpates;
            var nmDerrotas = data.nmDerrotas;
          }

          list.push({
              posicao   : colocacao,
              jogador   : data.nickName,
              vidas     : data.nmVidas,
              vitorias  : data.nmVitorias,
              empates   : data.nmEmpates,
              derotas   : data.nmDerrotas
          });
        }

        response = {
          classification: list,
          reason: Func.reason(1, 0, 'Consulta realizada com sucesso.')
        }
      } else {
        response = {
          reason: Func.reason(0, 4000, 'Não foi possivel consultar o classificação.')
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

module.exports = Classification;
