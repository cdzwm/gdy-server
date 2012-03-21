//module name: server
//description: define server.
// system module dependences
var	EventEmitter = require("events").EventEmitter;
var exp = new EventEmitter();// inherit from events.EventEmitter

var 	net = require("net")
		,fs = require("fs")
		,path = require("path");

// Third module dependences
var	mysql = require("mysql");

// project module dependences
var gdyutil = require("./comm/gdyutil");
var session = require("./session");
var room = require("./room");

// data structure
global.getServer= function(){
	return exp;
}

var _server = {};  // Server data

function hasServerProperty(name){
	return _server.hasOwnProperty(name);
}

// Init server data
if( !hasServerProperty("sessions") )
	_server.sessions = {}; 

if( !hasServerProperty("rooms") )
	_server.rooms = [];

if( !hasServerProperty("playerCount") )
	_server.playerCount = 0;

// find configuration path and name
function findConfigFilename(){
	// default configuration file in the same directory as server.js
	var configFilename = null;
	console.assert( typeof(require.main) === 'object' );

	if( typeof(require.main) === 'object' ){
		configFilename = path.dirname(require.main.filename);
		configFilename += path.normalize("/serverconf.json");
	}else{
		DBG_LOG("Don't run in REPL!");
		process.exit(-1);
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

// Determine if there is a session id
exp.hasSession = function(sessionid){
	return  _server.sessions.hasOwnProperty(sessionid);
}

exp.getSession = function (sessionid){
	if( exp.hasSession(sessionid) )
		return _server.sessions[sessionid];
	else
		return null;
}

exp.clearMessageQueue = function(sessionid){
	var thissession = exp.getSession(sessionid);
	thissession.mq = [];
}

exp.clearDataBuffer = function(sessionid){
	var thissession = exp.getSession(sessionid);
	thissession.data = "";
}

exp.clearHandlers = function(sessionid){
	var thissession = exp.getSession(sessionid);
	thissession.handlers=[];
}

exp.removeSession = function(sessionid){
	var thissession = exp.getSession(sessionid);
	delete _server.sessions[sessionid];
}

// Init server function
initServer = function() { 
	_server.ready = false;

	// use fs.readFileSync to guarantee that me.serverconf gets a initial value.
	// JSON.parse can only parse json
	var configFilename;
	if( configFilename =findConfigFilename()){
		_server.serverconf = JSON.parse(fs.readFileSync(configFilename), "utf8");
	}
	else{
		DBG_LOG("e", "Configuration not found!");
		process.exit(-1);
	}

	// Init database connection
	global.mysql_client = mysql.createClient({
		host: exp.getDatabaseServer(),
	  user: exp.getDatabaseUser(),
	  password: exp.getDatabasePassword(),
		database: exp.getDatabaseName()
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

function addSession(s){
	_server.sessions[s.sessionid] = s;
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
		addSession( session.newSession(s) );
	});

	var TIMER_INTERVAL = 50;
	var timer = setTimeout(waitServerReady, TIMER_INTERVAL);
	function waitServerReady(){
		if( _server.ready ){
			server.maxConnections = _server.serverconf.maxConnections;
			server.listen(_server.serverconf.server_port, function(){
				exp.emit("ready");
			});
		}
		else{
			DBG_LOG("i", "wait server is ready ...");
			setTimeout(waitServerReady, TIMER_INTERVAL);
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

exp.getServerName = function(){
	return "gdy server";
}

exp.getDatabaseServer = function(){
	return _server.serverconf.db_server;
}

exp.getDatabaseUser = function(){
	return _server.serverconf.db_user;
}

exp.getDatabasePassword = function(){
	return _server.serverconf.db_password;
}

exp.getDatabaseName = function(){
	return _server.serverconf.db_name;
}

module.exports = exp;
