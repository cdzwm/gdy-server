/* GameUser module file.
properties:
	id
	playerKey
	socket
	name
	nickname
	description
	sex
	level
	money
	lastLoginTime
	loginTimes
	game
	room
	table

methods:
	sendMessage

events:
	onHello
	onLogin
	onLoginSuccess
	onLoginFailed
	onDeal
	onReceiveMessage
	onBeginGame
	onEndGame
	onQuitGame
	onTimeout
	onLogout
*/


// GameUser class construction function.

exports.Player = function(s){
	this.s = s;
}

// dump 
exports.Player.prototype.dumpPlayer =  function (){
}
