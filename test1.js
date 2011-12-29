Object.prototype.cloneObject=function() {
	var clone = {};
	for(var i in this) {
		if(typeof(this[i])=="object")
			clone[i] = cloneObject(this[i]);
		else
			clone[i] = this[i];
	}
	return clone;
}

function Card(){
}

var card1 = new Card();
var card2 = card1.cloneObject();
var card3 = {};
var card4 = card3.cloneObject();

card2.a=3;
card2.b=4;

console.log(card1);
console.log(card2);
console.log(card3);
console.log(card4);
