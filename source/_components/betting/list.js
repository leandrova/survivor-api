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