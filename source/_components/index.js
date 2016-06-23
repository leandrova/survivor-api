'use strict';

var md5   = require('md5');

class Base {

  constructor() {
  }

  reason(status, descripton){
    if (status)
    	descripton = 'Requisicao realizada com sucesso.';
    return new Object({
      status: status,
      descripton: descripton
    });
  }

  date() {
  	var date = new Date();
    return date.getUTCFullYear() + '/' + date.getUTCMonth() + '/' + date.getUTCDate();
  }

  time() {
    var date = new Date();
    return date.getHours() + ':' + date.getUTCMinutes() + ':' + date.getSeconds();
  }

  tokenGeneration(a) {
  	return md5(this.date() + '' + this.time() + '' + a);
  }

}

module.exports = Base;