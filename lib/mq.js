/* 
module name: mq
description: message queue module.
*/

exports.createMQ = function(){
	return new MessageQueue();
}

function MessageQueue(){
	this.mq = [];
	this.in = function(msg){
		this.mq.push(msg);
	}

	this.out = function(){
		return this.mq.shift();
	}

	this.length = function(){
		return mq.length;
	}
}
