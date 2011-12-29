var poker = require("../lib/poker");
console.log(Object.prototype.hasOwnProperty('cloneObject'));

var test_cases = [
[
],

// 单牌测试
[
{name : "黑桃A", type : "spades", point : 14, next : 2, prev: 13}
],
[
{name : "黑桃2", type : "spades", point : 15, prev : 1}
],
[
{name : "黑桃3", type : "spades", point : 3, next : 4}
],
[
{name : "黑桃4", type : "spades", point : 4, next : 5, prev : 3}
],
[
{name : "红桃Q", type : "hearts", point : 12, next : 26, prev : 24}
],
[
{name : "红桃K", type : "hearts", point : 13, next : 14, prev : 25}
],
[
{name : "小王", type : "joker", point : 16, next : 54}
],
[
{name : "大王", type : "joker", point : 17, prev : 53}
],

// 两张牌测试
[
{name : "黑桃A", type : "spades", point : 14, next : 2, prev: 13},
{name : "黑桃2", type : "spades", point : 15, prev : 1}
],
[
{name : "黑桃2", type : "spades", point : 15, prev : 1},
{name : "黑桃2", type : "spades", point : 15, prev : 1}
],
[
{name : "黑桃3", type : "spades", point : 3, next : 4},
{name : "黑桃2", type : "spades", point : 15, prev : 1}
],
[
{name : "黑桃4", type : "spades", point : 4, next : 5, prev : 3},
{name : "小王", type : "joker", point : 16, next : 54}
],
[
{name : "红桃Q", type : "hearts", point : 12, next : 26, prev : 24},
{name : "大王", type : "joker", point : 17, prev : 53}
],
[
	{name : "黑桃A", type : "spades", point : 14, next : 2, prev: 13},
	{name : "红桃A", type : "hearts", point : 14, next : 15, prev : 26},
	{name : "梅花A", type : "diamonds", point :14 , next : 28, prev : 39},
	{name : "方块A", type : "clubs", point :14 , next : 41, prev : 52}
]

];

var thecards = poker.getCards();
var mycards = [];
var card;
for( card in thecards )
	mycards.push(thecards[card]);

for (var i = 0; i<1; i++){
	var result = poker.shuffle(mycards);
	var cards = [];
	var pos = Math.floor(Math.random() * result.length);
	cards.push(result[pos]);
	
	pos = Math.floor(Math.random() * result.length);
	cards.push(result[pos]);

	pos = Math.floor(Math.random() * result.length);
	cards.push(result[pos]);

//	pos = Math.floor(Math.random() * result.length);
//	cards.push(result[pos]);

	var suits = poker.getSuits(cards);
	if( suits.length > 0 ){
//		console.log("---------OK---------");
//		console.log(cards);
//		console.log("****************");
//		for( var suit in suits ){
//			console.log(suits[suit]);
//		}
	}
	else{
		if( poker.getKingCount(cards) > 0){
			console.log("---------BAD---------");
			console.log(cards);
		}
	}
}
