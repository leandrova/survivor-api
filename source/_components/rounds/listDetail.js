 listDetail(req, session, callback) {
  var roundNumber   = req['roundNumber'];

  var correntRound = session['correntRound'];

  var codigoJogador   = req['codigoJogador'];
  var codigoSurvivor  = req['codigoSurvivor'];

  if (!codigoJogador)
    var codigoJogador   = session['codigoJogador'];

  if (!codigoSurvivor)
    var codigoSurvivor  = session['codigoSurvivor'];

  Data.processaSql(
    Data.consulta({
      campos    : ' sr.codigoRodada, st1.siglaTime siglaTimeA, st1.nomeTime nomeTimeA, sr.placarTimeA, st2.siglaTime siglaTimeB, st2.nomeTime nomeTimeB, sr.placarTimeB, sr.dataJogo, sr.horaJogo, se.nomeEstadio ',
      tabelas   : ' sur_rodadas sr  left join sur_times st1 on st1.codigoTime = sr.codigoTimeA left join sur_times st2 on st2.codigoTime = sr.codigoTimeB left join sur_estadios se on se.codigoEstadio = sr.codigoEstadio ',
      condicoes : ' sr.codigoSurvivor = "' + codigoSurvivor + '" ' + (roundNumber ? ' and sr.codigoRodada = "' + roundNumber + '"' : ' and sr.codigoRodada = "' + correntRound + '"') + ' ',
      ordenacao : ' sr.codigoRodada, sr.dataJogo, sr.horaJogo, st1.nomeTime '
    }),
    function (res) {
      if ( res.lines ) {
        var response = {}, list = [], classification = {}, i = 0;

        for (i = 0; i < res.lines; i++) { 
          list.push({
            codigoRodada: res.results[i].codigoRodada,
            siglaTimeA: res.results[i].siglaTimeA, 
            nomeTimeA: res.results[i].nomeTimeA,
            placarTimeA: res.results[i].placarTimeA, 
            siglaTimeB: res.results[i].siglaTimeB, 
            nomeTimeB: res.results[i].nomeTimeB, 
            placarTimeB: res.results[i].placarTimeB, 
            dataJogo: res.results[i].dataJogo, 
            horaJogo: res.results[i].horaJogo, 
            nomeEstadio: res.results[i].nomeEstadio,
          });
        }

        response = {
          roundDetail: {
            correntRound: correntRound,
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