// Third module dependences
var	mysql = require("mysql");
var server = getServer();
var mysql_client = mysql.createClient({
	host: server.getDatabaseServer(),
	user: server.getDatabaseUser(),
	password: server.getDatabasePassword(),
	database: server.getDatabaseName()
});

exports.initDatabaseConnection = function(){
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

exports.login = function(playerName, passWord){
}
