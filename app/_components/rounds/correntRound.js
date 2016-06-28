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
