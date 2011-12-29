//module name: room
//description: define room.

var table = require("./table");
module.exports.createRoom = function(rconf){
	var r = {
		name : rconf.name,
		tables : [],
		addTable : function(tbl){
			r.tables.push(tbl);
		}
	};
	
	for(var t in rconf.tables ){
		r.addTable(table.createTable(rconf.tables[t], r));
	}

	if( DEBUG )
		console.log("Room " + r.name + " Created.");
	
	return r;
}
