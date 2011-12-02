/* GameUser module file.
properties:
	socket
	name
	nickname
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

*/


// GameUser class construction function.
exports.Player = function(s){
	this.s = s;
}

// dump 
exports.Player.prototype.dumpPlayer =  function (){
	console.dir(this);
}
