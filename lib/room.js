/* 
module name: room
description: define room.
*/

module.exports.createRoom = function(name){
	var room = {
		name: name,
		poc : 0
	};
	return room;
}
