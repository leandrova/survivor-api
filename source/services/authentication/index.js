'use strict';

var Base = require('../../_components/index.js');
var Store = require('../../_store/index.js');
var Data = new Store();

class Authentication extends Base {

 constructor() {
 	super();
 	console.log('Constructor Authentication');
 	var user = 'leandro';
 	var pass = '777e6b872bc84ab60b937056f30cce5f';
	Data.consulta({
		tabelas: 'usuarios',
		condicoes: 'nom = "' + user + '" and senha = "' + pass + '"'
	});
 }
 
}

module.exports = Authentication;