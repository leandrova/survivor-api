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