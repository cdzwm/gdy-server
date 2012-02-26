//module name: server
//description: define server.

// system module dependences
var	EventEmitter = require("events").EventEmitter
		,net = require("net")
		,fs = require("fs")
		,path = require("path");

// Third module dependences
var	mysql = require("mysql");

// project module dependences
var session = require("./session");
var room = require("./room");

module.exports = new EventEmitter();// inherit from events.EventEmitter

// get configuration path and name
function findConfigFilename(){
	// default configuration file in the same directory as server.js
	var configFilename;
	if( typeof(require.main) === "object"  ){
		configFilename = path.dirname(require.main.Filename);
		configFilename += path.normalize("/serverconf.json");
	}

	try{
		fs.closeSync(fs.openSync(configFilename, "r"));
	}
	catch(e){
		DBG_LOG("e", "Cannot open configuration file: '" + configFilename +"'");
		configFilename = undefined;
	}
	return configFilename;		
}

var server = {};

module.exports.server = server;

module.exports.server_conf = function(){
	return server.name;
}

// Init server function
initServer = function() { 
	server.ready = false;
	// default server configuration.
	server.serverconf ={
		"name": "Gan Deng Yan",
		"version": "0.0.1",
		"server_port": "10086",
		"description": "A poker game."
	}

	// use fs.readFileSync to guarantee that me.serverconf gets a initial value.
	// JSON.parse can only parse json
	var configFilename;
	if( configFilename =findConfigFilename()){
		server.serverconf = JSON.parse(fs.readFileSync(configFilename), "utf8");
	}
	else{
		DBG_LOG("e", "Configuration error. use default configuration.");
	}

	// Init sessions
	server.sessions = {};

	// Init database connection
	global.mysql_client = mysql.createClient({
		host: server.serverconf.db_server,
	  user: server.serverconf.db_user,
	  password: server.serverconf.db_password,
		database: server.serverconf.db_name
	});

	mysql_client.query("select * from player limit 0,1", function(err, results, field){
		if( err ){
			DBG_LOG("e", "Init database error.");
			DBG_LOG("e", err);
			DBG_LOG("e", "Server finished.");
			process.exit(-1);
		}
		else{
			server.ready = true
			DBG_LOG("Init database ok.");
		}
	});

	// Add global server_rooms
	if( !server.hasOwnProperty("server_rooms") )
		server.server_rooms = [];

	// create rooms
	DBG_LOG("i", "Create game rooms");

	var rooms = server.serverconf.rooms;
	for( var r in rooms ){
		addRoom( room.createRoom(rooms[r]) );
	}
}

//Start sever
module.exports.startServer = function (){
	// Init server envirment.
	initServer();
	var server = net.createServer(function(s){
		DBG_LOG("i", "New connection from " + s.remoteAddress + ":" + s.remotePort);
		session.newSession(s);
	});

	var timer = setTimeout(waitServerReady, 5);
	function waitServerReady(){
		if( server.ready ){
			server.maxConnections = server.serverconf.maxConnections;
			server.listen(server.serverconf.server_port, function(){
				module.exports.emit("ready");
			});
		}
		else{
			DBG_LOG("i", "wait server is ready ...");
			setTimeout(waitServerReady, 5);
		}
	}
}

function addRoom(room){
	ret = true;
	server.server_rooms.push(room);
	DBG_LOG("i", room.name + " added.");
	return ret;
}

