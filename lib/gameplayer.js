/* GameUser module file.
*/

// GameUser class construction function.
exports.GameUser = function(name , age , level ){
	this.userName = typeof(name) == 'undefined' ? 'test' : name.toString();
	this.address= "";
	this.port = "";
	this.dump = dumpUser;
}

// dump 
function dumpUser(){
	console.dir(this);
}