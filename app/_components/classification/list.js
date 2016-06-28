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
