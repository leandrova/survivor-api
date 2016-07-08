'use strict';

var md5		= require('md5');
var cookie	= require('cookie');

class Base {

  constructor() {
  }

  reason(status, error, description){

    var listError = new Object({
      '1000': 'Channel invalido',
      '2000': 'Login ou Senha Invalidos',
      '3000': 'Sessão invalida',
      '3100': 'Falha na criação da sessão',
      '4000': 'Falha na consulta do mapa',
      '5000': 'Rodada fechada',
      '5100': 'Falha ao apagar um palpite ja feito',
      '5200': 'Falha ao alterar um palpite ja feito',
      '5300': 'Falha ao cadastrar um palpite ja feito',
      '5400': 'Time já utilizado em um palpite anterior',
      '9000': 'Error in connection database',
      '9001': 'Error in connection database',
      '9002': 'Falha na consulta ao banco de dados',
    });

    if (listError[error] !== 'undefined'){
      description = listError[error];
    }

    if ((status)&&(!description))
    	description = 'Requisicao realizada com sucesso.';
    return new Object({
      status: status,
      error: error,
      description: description
    });
  }

  date() {
  	var date = new Date();
    return date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate();
  }

  time(a, b) {
    var date = new Date();
    if (a == 'm') {
    	date.setMinutes(date.getMinutes() + b);
    	var response = date.getHours() + ':' + date.getUTCMinutes() + ':' + date.getSeconds();
    } else if (a == 'h') {
    	date.setHours(date.getHours() + b);
    	var response = date.getHours() + ':' + date.getUTCMinutes() + ':' + date.getSeconds();
    } else {
    	var response = date.getHours() + ':' + date.getUTCMinutes() + ':' + date.getSeconds();
    }
    return response;
  }

  dataInterna(a) {
    var date = new Date(a);
    return date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate();;
  }

  getCookie(a, b) {
    var response = '';
    if (typeof a.cookie !== "undefined"){
      var c = cookie.parse(a.cookie);
      var response = c[b];
    }
  	return response;
  }

  tokenGeneration(a) {
  	return md5(this.date() + '' + this.time() + '' + a);
  }

  md5(a) {
    return md5(a);
  }

  encryption(a) {
    return md5(a);
  }

  invalidChannel() {
  	return this.reason(0, 1000, 'Channel invalido.');
  }

  invalidSession() {
  	return this.reason(0, 3000, 'A sessão não está mais ativa.');
  }

  addslashes(string) {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
  }

}

module.exports = Base;
