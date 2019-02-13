 auditing(service, method, body, header, result){ 

  var session = header['service-session'];
  if (!session)
    session = Func.getCookie(header, 'service-session');
  
  body    = Func.addslashes(JSON.stringify(body));
  header  = Func.addslashes(JSON.stringify(header));
  result  = Func.addslashes(result ? JSON.stringify(result) : '');

  Data.processaSql(
    Data.consulta({
      tabelas   : 'sur_parametros',
      condicoes : 'codigoParametro = 1 and valor = "1"'
    }),
    function (res){
      if (res.lines) {
        Data.processaSql(
          Data.cadastro({
            campos    :   'codigoSessao, service, method, body, header, result, dataCadastro, horaCadastro',
            tabelas   :   'sur_service_auditing',
            values    :   ' "' + session + '", "' + service + '", "' + method + '", "' + body + '", "' + header + '", "' + result + '", "' + Func.date() + '", "' + Func.time() + '"'

          }),
          function (ress) {
          }
        );
      } else {
      }
    }
  );
 }