'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class Map extends Base {

 constructor() {
 	super();
 }

@@include('../../_components/map/list.js')

@@include('../../_components/rounds/correntRound.js')

@@include('../../_components/checkSession.js')

@@include('../../_components/auditing.js');
 
}

module.exports = Map;
