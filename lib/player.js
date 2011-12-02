/* GameUser module file.
properties:
	id
	userkey
	socket
	name
	nickname
	description
	sex
	level
	money
	lastLoginTime
	loginTimes

methods:
	sendMessage
	deal

events:
	onReceiveMessage
	onQuitGame
	onBeginGame
	onDeal
	onLogin
	onLoginSuccess
	onLoginFailed
	onTimeout
	onLogout
	onEndGame
*/


// GameUser class construction function.

exports.Player = function(s){
	this.s = s;
}

// dump 
exports.Player.prototype.dumpPlayer =  function (){
	console.dir(this);
}
