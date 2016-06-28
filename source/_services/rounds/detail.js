'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class RoundsDetail extends Base {

 constructor() {
 	super();
 }

@@include('../../_components/rounds/listDetail.js')

@@include('../../_components/rounds/correntRound.js')

@@include('../../_components/checkSession.js')
 
}

module.exports = RoundsDetail;
