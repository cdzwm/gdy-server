// Third module dependences
var	mysql = require("mysql");
var mysql_client ;

exports.initDatabaseConnection = function(){
	var server = getServer();
	mysql_client = mysql.createClient({
		host: server.getDatabaseServer(),
		user: server.getDatabaseUser(),
		password: server.getDatabasePassword(),
		database: server.getDatabaseName()
	});
	
	mysql_client.query("select * from player limit 0,1", function(err, results, field){
		if( err ){
			DBG_LOG("e", "Init database error.");
			DBG_LOG("e", err);
			DBG_LOG("e", "Server finished.");
			process.exit(-1);
		}
		else{
			DBG_LOG("Init database ok.");
		}
	});
}

exports.login = function(playerName, password, result){
	var server = getServer();
	var query = mysql_client.query("select * from player where name =? and password=?", [playerName, password], function(err, results, fields){
		var loginResult = !err && (results.length == 1);
		result(loginResult);
	});
}
