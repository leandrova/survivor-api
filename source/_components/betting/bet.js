 bet(req, session, callback) {
  var codigoTime      = req['codeTeam'];

  var codigoSurvivor  = session['codigoSurvivor'];
  var codigoJogador   = session['codigoJogador'];
  var correntRound    = session['correntRound'];
  var roundStatus     = session['roundStatus'];
  var codigoUsuario   = session['codigoUsuario'];

  if (roundStatus) {
    Data.processaSql(
      Data.consulta({
        tabelas   :   'sur_palpites',
        condicoes :   'codigoJogador = ' + codigoJogador + ' and codigoSurvivor = ' + codigoSurvivor + ' and codigoTime = ' + codigoTime + ' and codigoRodada <> ' + correntRound
      }),
      function (res) {
        if (!res.lines) {
          Data.processaSql(
            Data.consulta({
              tabelas   :   'sur_palpites',
              condicoes :   'codigoJogador = ' + codigoJogador + ' and codigoSurvivor = ' + codigoSurvivor + ' and codigoRodada = ' + correntRound
            }),
            function (ress) {
              if ( ress.lines ) {
                var data = ress.results[0];
                if (data.codigoTime == codigoTime) {
                  Data.processaSql(
                    Data.deleta({
                      tabelas   :   'sur_palpites',
                      condicoes :   'codigoSurvivor = ' + codigoSurvivor + ' and ' +
                                    'codigoRodada = ' + correntRound + ' and codigoJogador = ' + codigoJogador
                    }),
                    function (resss) {
                      if ( resss.results.affectedRows ){
                        var response = {
                          reason: Func.reason(1, 0, 'Palpite desfeito com sucesso.')
                        }
                      } else {
                        var response = {
                          reason: Func.reason(0, 5100, 'Ops! Não foi possivel desfazer o seu palpite.')
                        }
                      }
                      callback(response);
                    }
                  );
                } else {
                  Data.processaSql(
                    Data.altera({
                      campos    :   'codigoTime = ' + codigoTime,
                      tabelas   :   'sur_palpites',
                      condicoes :   'codigoSurvivor = ' + codigoSurvivor + ' and codigoRodada = ' + correntRound + ' and codigoJogador = ' + codigoJogador
                    }),
                    function (ress) {
                      if ( ress.results.affectedRows ){
                        var response = {
                          reason: Func.reason(1, 0, 'Palpite alterado com sucesso.')
                        }
                      } else {
                        var response = {
                          reason: Func.reason(0, 5200, 'Ops! Não foi possivel alterar o seu palpite.')
                        }
                      }
                      callback(response);
                    }
                  );
                }
              } else {
                Data.processaSql(
                  Data.cadastro({
                    campos    :   'codigoSurvivor, codigoRodada, codigoTime, codigoJogador, dataCadastro, horaCadastro, usuarioCadastro',
                    tabelas   :   'sur_palpites',
                    values    :   '' + codigoSurvivor + ', ' + correntRound + ',' + codigoTime + ', ' + codigoJogador + ', "' + Func.date() + '", "' + Func.time() + '", ' + codigoUsuario + ''

                  }),
                  function (ress) {
                    if ( ress.results.affectedRows ) {
                      var response = {
                        reason: Func.reason(1, 0, 'Palpite cadastrado com sucesso.')
                      }
                    } else {
                      var response = {
                        reason: Func.reason(0, 5300, 'Ops! Não foi possivel cadastrar o seu palpite.')
                      }
                    }
                    callback(response);
                  }
                );
              }
            }
          );
        } else {
          callback({
            reason: Func.reason(0, 5400, 'Ops! Esse time já foi utilizado em um palpite anterior.')
          })
        }
      }
    );
  } else {
    callback({
      reason: Func.reason(0, 5000, 'Ops! A rodada está fechada.')
    });
  }
 }
