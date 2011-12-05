/* Message queue module.
*/
var mq =[];
exports.in = function(message){
	return mq.push(message);
}

exports.out = function(){
	return mq.shift();
}
