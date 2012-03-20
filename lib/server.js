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
var gdyutil = require("./comm/gdyutil");
var session = require("./session");
var room = require("./room");

var exp = new EventEmitter();// inherit from events.EventEmitter

// data structure
var _server = {};  // top level data

if( !_server.hasOwnProperty("sessions") )
	_server.sessions = {}; // sessions

// Add global server_rooms
if( !_server.hasOwnProperty("rooms") )
	_server.rooms = [];

if( !_server.hasOwnProperty("playerCount") )
	_server.playerCount = 0;

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

// Determin if there is a session id
exp.hasSession = hasSession;
function hasSession(sessionid){
	return  _server.sessions.hasOwnProperty(sessionid);
}

exp.getSession = getSession;
function getSession(sessionid){
	if( hasSession(sessionid) )
		return _server.sessions[sessionid];
	else
		return null;
}

exp.clearMessageQueue = function(sessionid){
	var thissession = getSession(sessionid);
	thissession.mq = [];
}

exp.clearDataBuffer = function(sessionid){
	var thissession = getSession(sessionid);
	thissession.data = "";
}
exp.clearHandlers = function(sessionid){
	var thissession = getSession(sessionid);
	thissession.handlers=[];
}

exp.removeSession = function(sessionid){
	var thissession = getSession(sessionid);
	delete _server.sessions[sessionid];
}
// Init server function
initServer = function() { 
	_server.ready = false;
	// default server configuration.
	_server.serverconf ={
		"name": "Gan Deng Yan",
		"version": "0.0.1",
		"server_port": "10086",
		"description": "A poker game."
	}

	// use fs.readFileSync to guarantee that me.serverconf gets a initial value.
	// JSON.parse can only parse json
	var configFilename;
	if( configFilename =findConfigFilename()){
		_server.serverconf = JSON.parse(fs.readFileSync(configFilename), "utf8");
	}
	else{
		DBG_LOG("e", "Configuration error. use default configuration.");
	}

	// Init database connection
	global.mysql_client = mysql.createClient({
		host: _server.serverconf.db_server,
	  user: _server.serverconf.db_user,
	  password: _server.serverconf.db_password,
		database: _server.serverconf.db_name
	});

	mysql_client.query("select * from player limit 0,1", function(err, results, field){
		if( err ){
			DBG_LOG("e", "Init database error.");
			DBG_LOG("e", err);
			DBG_LOG("e", "Server finished.");
			process.exit(-1);
		}
		else{
			_server.ready = true
			DBG_LOG("Init database ok.");
		}
	});

	// create rooms
	DBG_LOG("i", "Create game rooms");

	var rooms = _server.serverconf.rooms;
	for( var r in rooms ){
		addRoom( room.createRoom(rooms[r]) );
	}
}

function addSession(socket){
	var sessionid = session.newSessionId(socket)
	while( hasSession(sessionid) ){
		 sessionid = session.newSessionId(socket);
	}

	var newsession = session.newSession(sessionid, socket);
	_server.sessions[newsession.sessionid] = newsession;
}

// server version
exp.version = function(){
	return _server.serverconf.version;
}

//Start sever
exp.startServer = function (){
	// Init server envirment.
	initServer();
	var server = net.createServer(function(s){
		DBG_LOG("i", "New connection from " + s.remoteAddress + ":" + s.remotePort);
		addSession(s);
	});

	var timer = setTimeout(waitServerReady, 5);
	function waitServerReady(){
		if( _server.ready ){
			server.maxConnections = _server.serverconf.maxConnections;
			server.listen(_server.serverconf.server_port, function(){
				exp.emit("ready");
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
	_server.rooms.push(room);
	DBG_LOG("i", room.name + " added.");
	return ret;
}

exp.getRooms = function(){
	return gdyutil.cloneObject(_server.rooms);
}

exp.getPlayerCount = function(){
	return _server.playerCount;
}

exp.increasePlayerCount = function(){
	_server.playerCount ++;
}

global.getServer= function(){
	return module.exports;
}

module.exports = exp;
