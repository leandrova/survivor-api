'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class Players extends Base {

 constructor() {
 	super();
 }

@@include('../../_components/players/list.js')

@@include('../../_components/checkSession.js')

@@include('../../_components/auditing.js');
 
}

module.exports = Players;
