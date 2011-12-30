//module name: server
//description: define server.

// system module depencies
var	EventEmitter = require("events").EventEmitter
		,net = require("net")
		,fs = require("fs")
		,path = require("path")
		,mysql = require("mysql");

// project module depencies
var session = require("./session");
var room = require("./room");

module.exports = new EventEmitter();// inherit from events.EventEmitter

// get configuration path and name
function findConfigFileName(){
	// default configuration file in the same directory as server.js
	var configFileName;
	if( typeof(require.main) === "object"  ){
		configFileName = path.dirname(require.main.filename);
		configFileName += path.normalize("/serverconf.json");
	}

	try{
		fs.closeSync(fs.openSync(configFileName, "r"));
	}
	catch(e){
		DBG_LOG("Cannot open configuration file: '" + configFileName +"'");
		configFileName = undefined;
	}
	return configFileName;		
}

initServer = function() { 
	// default server configuration.
	global.serverconf ={
		"name": "Gan Deng Yan",
		"version": "0.0.1",
		"server_port": "10086",
		"description": "A poker game."
	}

	// use fs.readFileSync to guarantee that me.serverconf gets a initial value.
	// JSON.parse can only parse json
	var configFileName;
	if( configFileName =findConfigFileName()){
		global.serverconf = JSON.parse(fs.readFileSync(findConfigFileName()), "utf8");
	}
	else{
		DBG_LOG("GDY - Error: Configuration error. use default configuration.");
	}

	// Init database connection
	DBG_LOG("GDY - Info: Init game server database connection.");

	global.mysql_client = mysql.createClient({
		host: global.serverconf.db_server,
	  user: global.serverconf.db_user,
	  password: global.serverconf.db_password,
		database: global.serverconf.db_name
	});

	// Add global server_rooms
	if( !global.hasOwnProperty("server_rooms") )
		global.server_rooms = [];

	// create rooms
	DBG_LOG("Create game rooms");

	var rooms = serverconf.rooms;
	for( var r in rooms ){
		addRoom( room.createRoom(rooms[r]) );
	}
}

//Start sever
module.exports.startServer = function (){
	// Init server envirment.
	initServer();
	var server = net.createServer(function(s){
		DBG_LOG("New connection from " + s.remoteAddress + ":" + s.remotePort);
		session.newSession(s);
	});
	
	server.maxConnections = serverconf.maxConnections;
	server.listen(serverconf.server_port, function(){
		module.exports.emit("ready");
	});
}

function addRoom(room){
	ret = true;
	server_rooms.push(room);

	DBG_LOG(room.name + " added.");

	return ret;
}
