/* GameUser module file.
*/

// GameUser class construction function.
exports.Player = function(id, s, name , age , level ){
	this.id = id;
	this.s = typeof(s) == 'undefined' ? undefined : s;
	this.name = typeof(name) == 'undefined' ? 'test' : name.toString();
	this.age = typeof(age) == "undefined" ? 0 : parseInt(age);
	this.level = typeof(level) == "undefined" ? 0 : parseInt(level);
	this.address= "";
	this.port = "";
	this.dump = dumpUser;
}

// dump 
function dumpUser(){
	console.dir(this);
}
