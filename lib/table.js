//module name: table
//description: define game table module file.

module.exports.createTable = function(tconf, room){
	var t = {
		name: tconf.name
	};

	DBG_LOG("Table " + t.name + " Created.");
	return t;
}
