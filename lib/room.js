//module name: room
//description: define room.

var table = require("./table");
module.exports.createRoom = function(rconf){
	var r = {
		id : rconf.id,
		name : rconf.name,
		tables : [],
		addTable : function(tbl){
			r.tables.push(tbl);
		}
	};
	
	for(var t in rconf.tables ){
		r.addTable(table.createTable(rconf.tables[t], r));
	}

	DBG_LOG("i", "Room " + r.name + " Created.");
	
	return r;
}
