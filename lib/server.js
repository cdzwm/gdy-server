//module name: server
//description: define server.

// system depencies
var	EventEmitter = require('events').EventEmitter
		,net = require('net')
		,fs = require('fs')
		,path = require('path')
		,mysql = require("mysql");

var session = require("./session");
var room = require("./room");

// inherit from events.EventEmitter
var exports = module.exports = new EventEmitter();
var server; // reference server object.

// get configuration filename
function getConfigFileName(){
	// default configuration file in the same directory as gameserver.js
	var configFileName = path.normalize('./serverconf.json'); 
	if( typeof(require.main) === 'object'  ){
		configFileName = path.dirname(require.main.filename);
		configFileName += path.normalize('/serverconf.json');
	}
	return configFileName;		
}

initServer = function() { 
	global.serverconf ={ // default server configuration.
		"name": "Gan Deng Yan",
		"version": "0.0.1",
		"server_port": "10086",
		"description": "A poker game."
	}

	// use fs.readFileSync to guarantee that me.serverconf gets a initial value.
	// JSON.parse can only parse json 
	try{
		global.serverconf = JSON.parse(fs.readFileSync(getConfigFileName()), "utf8");
	}catch(e){
		DBG_LOG("gdy - Error: Configuration error. use default configuration.");
	}

	// Init database connection
	DBG_LOG("Init database connection");

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
exports.startServer = function (){
	// Init server envirment.
	initServer();
	server = net.createServer(function(s){
		DBG_LOG("New connection from " + s.remoteAddress + ":" + s.remotePort);
		session.newSession(s);
	});
	
	server.maxConnections = serverconf.maxConnections;
	server.listen(serverconf.server_port, function(){
		exports.emit("ready");
	});
}

function addRoom(room){
	ret = true;
	server_rooms.push(room);

	DBG_LOG(room.name + " added.");

	return ret;
}
