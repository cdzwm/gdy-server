var net = require('net');

var msg_begin = "GDY_MSG_BEGIN{";
var msg_end="}GDY_MSG_END";

var hello1 = {"cmd": "HELLO{*}", "description":"handshake"};
var hello2 = {"cmd": "HELLO", "description":"handshake", "test":"a test"};

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
	hello1.cmd =  "HELLO";
	client.write(msg_begin + JSON.stringify(hello1) + msg_end);
}
function onReceiveMessage(data){
	console.log(data);
}

function sendMessage(){
	hello1.cmd =  "MSG";
	client.write(msg_begin + JSON.stringify(hello1) + msg_end);
	t = setTimeout(sendMessage, Math.round(Math.random() * 5000));
}
