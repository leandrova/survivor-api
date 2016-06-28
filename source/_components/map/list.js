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