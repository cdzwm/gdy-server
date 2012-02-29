// project dependences
var message = require("./comm/message")
	,createPlayer = require('./player').createPlayer
	,server = require("./server");

var callbacks={}; // message handle callback functions

// Set message handle callback functions

// default message handle function
callbacks["f_default"] = function(session, msg){
	DBG_LOG("i", msg.cmd);
	if( session.state != "LOGINED" ){
		session.sendMessage(message.new("ERROR"));
		session.end();
	}
	else{
		session.sendMessage(message.new(msg.cmd + "_resp"));
	}
}

// hello_ok message handle function
callbacks["f_hello_resp"] = function(session, msg){
	clearTimeout(session.helloTimer);

	session.timer = setTimeout(function(){
			session.sendMessage(message.new("HELLO"));
		}, 5000);

	DBG_LOG("i", "receive hello_resp");
}

// connect message handle function
callbacks["f_connect"] = function(session, msg){
	clearTimeout(session.timer);
	if( session.state == "CONNECT"){
		session.state = "LOGIN";
		session.sendMessage(message.new("CONNECT_OK"));
		session.timer = setTimeout(function(){
			DBG_LOG("i", "Session timeout.");
			session.end();
		}, 30000);
	}
	else{
		session.end();
	}
}

// login message handle function
callbacks["f_login"] = function(session, msg){
	if( typeof(session.socket) == "undefined" )
		throw "Error";

	var query = mysql_client.query("select * from player where name =? and password=?", [msg.username, msg.password], function(err, results, fields){
	// create a new user.
		clearTimeout(session.timer);
		if( err ){
			DBG_LOG("e", "Access database error.");
			session.sendMessage(message.new("LOGIN_FAILED"));
		}
		else{
			if( results.length == 1 && msg.username == results[0].name
				&& msg.password ==results[0].password ){

				var res = results[0];

				session.sendMessage(message.new("LOGIN_OK"));
				session.state="LOGINED";
				session.player = createPlayer("player");
				
				session.timer = setTimeout(function(){
						DBG_LOG("send hello");
						session.sendMessage(message.new("HELLO"));
						session.helloTimer = setTimeout(function(){
							session.end();
							DBG_LOG("e", "hello timeout");
						}, 2000);
					}, 2000);
			}
			else{// 登录失败 TODO: MUST CATCH ERROR
				try{
					session.sendMessage(message.new("LOGIN_FAILED"));
					session.end();
				}
				catch(e){
					DBG_LOG("e", e);
				}
			}
		}
	});
}

// util functions
function dumpMessage(msg){
	DBG_LOG(msg);
}

callbacks["f_list_room"] = function(session, msg){
	var m = message.new("LIST_ROOM_RESP");
	m.rooms = server.server_rooms;
	session.sendMessage(m);
}

callbacks["f_quit"] = function(session, msg){
	var m = message.new("QUIT_RESP");
	session.sendMessage(m);
	session.end();
}

callbacks["f_get_name"] = function(session, msg){
	var m = message.new(msg.cmd + "_resp");
	session.sendMessage(m);
}

callbacks["f_who"] = function(session, msg){
	session.getServerRooms();
	var m = message.new(msg.cmd + "_resp");
	m.u = "player";
	session.sendMessage(m);
}

callbacks["f_select_room"] = function(session, msg){

}

callbacks["f_count"] = function(session, msg){
	var m = message.new(msg.cmd + "_resp");
	var count = 0;
	for( u in server.sessions ) count++;
	m.count = count;
	session.sendMessage(m);

}

module.exports.handler = callbacks;
