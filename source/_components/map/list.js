 list(req, session, callback) {
  var roundNumber   = req['roundNumber'];
  var codigoJogador   = req['codigoJogador'];
  var codigoSurvivor  = req['codigoSurvivor'];
  var codigoRodada  = req['codigoRodada'];

  if (!codigoJogador)
    var codigoJogador   = session['codigoJogador'];

  if (!codigoSurvivor)
    var codigoSurvivor  = session['codigoSurvivor'];

  if (!codigoRodada)
    var codigoRodada  = session['correntRound'];

  var correntRound  = session['correntRound'];
  var roundStatus   = session['roundStatus'];

  Data.processaSql(
    Data.consulta({
      campos    :   'sm.codigoJogador, sj.nickname, sm.colocacao, sm.nmVidas, sm.nmVitorias, ' +
                    'sm.nmEmpates, sm.nmDerrotas, sm.codigoTime, st.siglaTime, st.nomeTime, ' +
                    'sm.resultado, sm.codigoRodada, sp.codigoTime palpite',
      tabelas   :   'sur_mapa sm left join sur_times st on sm.codigoTime = st.codigoTime ' +
                    'left join sur_jogadores sj on sj.codigoSurvivor = sm.codigoSurvivor and sj.codigoJogador = sm.codigoJogador ' +
                    'left outer join sur_palpites sp on sp.codigoSurvivor = sm.codigoSurvivor and sp.codigoJogador = sm.codigoJogador and sp.codigoTime = sm.codigoTime and sp.codigoRodada = ' + codigoRodada,
      condicoes :   'sm.codigoSurvivor = ' + codigoSurvivor + ' and sm.codigoJogador = ' + codigoJogador,
      ordenacao :   '2, 10'
    }),
    function (res) {
      if ( res.lines ){
        var response = {}, list = [], classification = {}, i = 0;
        var data = res.results[0];
        classification = {
          codigoJogador: data.codigoJogador,
              nickname: data.nickname,
              colocacao: data.colocacao,
              nmVidas: data.nmVidas,
              nmVitorias: data.nmVitorias,
              nmEmpates: data.nmEmpates,
              nmDerrotas: data.nmDerrotas
        }

        for (i = 0; i < res.lines; i++) { 
          var data = res.results[i], palpite = null;
          
          if ((data.codigoJogador == codigoJogador)&&(data.palpite == data.codigoTime))
            var palpite = true;


          list.push({
            codigoTime: data.codigoTime,
            siglaTime: data.siglaTime,
            nomeTime: data.nomeTime,
            resultado: data.resultado,
            codigoRodada: data.codigoRodada,
            palpite : palpite
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