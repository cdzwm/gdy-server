//module name: player
//description:  player module file.

// GameUser class construction function.
var EventEmitter = require('events').EventEmitter,
		crypto = require('crypto');
module.exports = new EventEmitter();

module.exports.createPlayer = function(name){
	var player = {
		id: 0
		,name : name
		,nickname: ""
		,description: ""
		,sex : ""
		,money: 0
		,lastLoginTime: new Date().getTime()
		,lastLogoutTime: undefined
		,loginTimes: 0
		,room: 0
		,table: 0
		,level : 0
		,blocked: 0
	};

	DBG_LOG("create player " + name);
	return player;
}
