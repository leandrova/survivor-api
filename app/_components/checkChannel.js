 checkChannel(header, callback) { 
  var host = header['host'];
  var name = header['service-name'];
  var token = header['service-token'];
  Data.processaSql(
    Data.consulta({
      tabelas   : 'sur_channels',
      condicoes : 'host = "' + host + '" and name = "' + name + '" and token = "' + token + '"'
    }),
      function (response){
      callback(response);
    }
  );
 }