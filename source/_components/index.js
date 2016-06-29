'use strict';

var md5		= require('md5');
var cookie	= require('cookie');

class Base {

  constructor() {
  }

  reason(status, error, descripton){
    if ((status)&&(!descripton))
    	descripton = 'Requisicao realizada com sucesso.';
    return new Object({
      status: status,
      error: error,
      descripton: descripton
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
  	var c = cookie.parse(a.cookie);
  	return c[b];
  }

  tokenGeneration(a) {
  	return md5(this.date() + '' + this.time() + '' + a);
  }

  invalidChannel() {
  	return this.reason(0, 1000, 'Channel invalido.');
  }

  invalidSession() {
  	return this.reason(0, 3000, 'A sessão não está mais ativa.');
  }

}

module.exports = Base;
