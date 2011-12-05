var net = require('net');

var hello = {"cmd": "HELLO"};
var client;

try{
	client = net.connect(10086, '127.0.0.1', function(){
	client.write(JSON.stringify(hello));
	setInterval(helloAgain, 2000);
});

}
catch(e){
	console.log(e.errno);
}

function helloAgain(){
	try
	{
		client.write(JSON.stringify(hello));
	}
	catch (e)
	{
		console.log(e);
	}
}
