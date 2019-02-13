'use strict';

var Store = require('../../_store/index.js');
var Data = new Store();

var Base = require('../../_components/index.js');
var Func = new Base();

class Authentication extends Base {

 constructor() {
 	super();
 }

@@include('../../_components/authentication/auth.js');

@@include('../../_components/checkChannel.js');

@@include('../../_components/auditing.js')
 
}

module.exports = Authentication;
