//module name: room
//description: define room.

var table = require("./table");
module.exports.createRoom = function(rconf){
	var r = {
	};
	r.name = rconf.name;
	for(var t in rconf.tables ){
		table.createTable(rconf.tables[t]);
	}

	if( DEBUG )
		console.log("Room " + r.name + " Created.");
	
	return r;
}
