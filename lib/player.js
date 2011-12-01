/* GameUser module file.
*/

// GameUser class construction function.
exports.Player = function(s){
	this.s = s;
	this.dump = dumpUser;
}

// dump 
function dumpUser(){
	console.dir(this);
}
