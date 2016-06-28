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