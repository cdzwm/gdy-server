var net = require('net');

var msg_begin = "GDY_MSG_BEGIN{";
var msg_end="}GDY_MSG_END";

var hello_msg = {"cmd": "MSG"};

var t
	,client = net.connect(10086, '127.0.0.1', function(){
	hello();
	t = setTimeout(sendMessage, 1000);
	client.setEncoding('utf8');
	client.on("close", function(){
		clearTimeout(t);
		console.log("exit");
	});
	client.on('data', onReceiveMessage);
});

client.on("error", function(err){
	if( err.code == "ECONNREFUSED")
		console.log("无法连接服务器");
});
function hello(){
	hello_msg.cmd =  "HELLO";
	client.write(msg_begin + JSON.stringify(hello_msg) + msg_end);
}
function onReceiveMessage(data){
	console.log(data);
}

function sendMessage(){
	hello_msg.cmd =  "MSG";
	var s = msg_begin + JSON.stringify(hello_msg) + msg_end;
	console.log(s);
	client.write(s);
	t = setTimeout(sendMessage, Math.round(Math.random() * 5000));
}
