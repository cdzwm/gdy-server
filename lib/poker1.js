var util = require('util');

var cards =[
{name : "黑桃A", type : "spade", point : 14},
{name : "黑桃2", type : "spade", point : 15},
{name : "黑桃3", type : "spade", point : 3},
{name : "黑桃4", type : "spade", point : 4},
{name : "黑桃5", type : "spade", point : 5},
{name : "黑桃6", type : "spade", point : 6},
{name : "黑桃7", type : "spade", point : 7},
{name : "黑桃8", type : "spade", point : 8},
{name : "黑桃9", type : "spade", point : 9},
{name : "黑桃10", type : "spade", point : 10},
{name : "黑桃J", type : "spade", point : 11},
{name : "黑桃Q", type : "spade", point : 12},
{name : "黑桃K", type : "spade", point : 13},
{name : "红桃A", type : "heart", point : 14},
{name : "红桃2", type : "heart", point : 15},
{name : "红桃3", type : "heart", point : 3},
{name : "红桃4", type : "heart", point : 4},
{name : "红桃5", type : "heart", point : 5},
{name : "红桃6", type : "heart", point : 6},
{name : "红桃7", type : "heart", point : 7},
{name : "红桃8", type : "heart", point : 8},
{name : "红桃9", type : "heart", point : 9},
{name : "红桃10", type : "heart", point : 10},
{name : "红桃J", type : "heart", point : 11},
{name : "红桃Q", type : "heart", point : 12},
{name : "红桃K", type : "heart", point : 13},
{name : "梅花A", type : "diamond", point :14},
{name : "梅花2", type : "diamond", point : 15},
{name : "梅花3", type : "diamond", point : 3},
{name : "梅花4", type : "diamond", point : 4},
{name : "梅花5", type : "diamond", point : 5},
{name : "梅花6", type : "diamond", point : 6},
{name : "梅花7", type : "diamond", point : 7},
{name : "梅花8", type : "diamond", point : 8},
{name : "梅花9", type : "diamond", point : 9},
{name : "梅花10", type : "diamond", point : 10},
{name : "梅花J", type : "diamond", point : 11},
{name : "梅花Q", type : "diamond", point : 12},
{name : "梅花K", type : "diamond", point : 13},
{name : "方块A", type : "club", point :14},
{name : "方块2", type : "club", point : 15},
{name : "方块3", type : "club", point : 3},
{name : "方块4", type : "club", point : 4},
{name : "方块5", type : "club", point : 5},
{name : "方块6", type : "club", point : 6},
{name : "方块7", type : "club", point : 7},
{name : "方块8", type : "club", point : 8},
{name : "方块9", type : "club", point : 9},
{name : "方块10", type : "club", point : 10},
{name : "方块J", type : "club", point : 11},
{name : "方块Q", type : "club", point : 12},
{name : "方块K", type : "club", point : 13},
{name : "小王", type : "joker", point : 16},
{name : "大王", type : "joker", point : 17}
];

function shuffle(cards){
	if( !util.isArray(cards) )
		return false;

	var card_count = cards.length - 1;
	for( var i = 0; i<card_count; i++){
		var j = Math.floor(i + 1 + Math.random() * ( card_count - i ));
		var temp = cards[i];
		cards[i] = cards[j];
		cards[j] = temp;
	}
}
shuffle(cards);
display_cards(cards);

console.log("---");
shuffle(cards);
display_cards(cards);

function display_cards(cards){
	if( !util.isArray(cards) )
		return false;
	
	for(var c in cards )
		console.log(cards[c].name);
}