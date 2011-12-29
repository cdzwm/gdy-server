//module name: table
//description: define game table module file.

module.exports.createTable = function(tconf, room){
	var t = {
		name: tconf.name
	};

	if( DEBUG )
		console.log("Table " + t.name + " Created.");
	return t;
}
