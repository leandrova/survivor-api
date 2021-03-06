'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class Bet extends Base {

 constructor() {
 	super();
 }

@@include('../../_components/betting/bet.js')

@@include('../../_components/rounds/correntRound.js')

@@include('../../_components/checkSession.js')

@@include('../../_components/auditing.js')
 
}

module.exports = Bet;
