//module name:  poker
//description: define poker

var gdyutil = require("../lib/comm/gdyutil");
// cards list
var thecards = {
	1 : {name : "黑桃A", type : "spades", point : 14, next : 2, prev: 13},
	2 : {name : "黑桃2", type : "spades", point : 20, prev : 1},
	3 : {name : "黑桃3", type : "spades", point : 3, next : 4},
	4 : {name : "黑桃4", type : "spades", point : 4, next : 5, prev : 3},
	5 : {name : "黑桃5", type : "spades", point : 5, next : 6, prev : 4},
	6 : {name : "黑桃6", type : "spades", point : 6, next : 7, prev : 5},
	7 : {name : "黑桃7", type : "spades", point : 7, next : 8, prev : 6},
	8 : {name : "黑桃8", type : "spades", point : 8, next : 9, prev : 7},
	9 : {name : "黑桃9", type : "spades", point : 9, next : 10, prev : 8},
	10 : {name : "黑桃10", type : "spades", point : 10, next : 11, prev : 9},
	11 : {name : "黑桃J", type : "spades", point : 11, next : 12, prev : 10},
	12 : {name : "黑桃Q", type : "spades", point : 12, next : 13, prev : 11},
	13 : {name : "黑桃K", type : "spades", point : 13, next : 1, prev : 12},
	14 : {name : "红桃A", type : "hearts", point : 14, next : 15, prev : 26},
	15 : {name : "红桃2", type : "hearts", point : 20, prev : 14},
	16 : {name : "红桃3", type : "hearts", point : 3, next : 17},
	17 : {name : "红桃4", type : "hearts", point : 4, next : 18, prev : 16},
	18 : {name : "红桃5", type : "hearts", point : 5, next : 19, prev : 17},
	19 : {name : "红桃6", type : "hearts", point : 6, next : 20, prev : 18},
	20 : {name : "红桃7", type : "hearts", point : 7, next : 21, prev : 19},
	21 : {name : "红桃8", type : "hearts", point : 8, next : 22, prev : 20},
	22 : {name : "红桃9", type : "hearts", point : 9, next : 23, prev : 21},
	23 : {name : "红桃10", type : "hearts", point : 10, next : 24, prev : 22},
	24 : {name : "红桃J", type : "hearts", point : 11, next : 25, prev : 23},
	25 : {name : "红桃Q", type : "hearts", point : 12, next : 26, prev : 24},
	26 : {name : "红桃K", type : "hearts", point : 13, next : 14, prev : 25},
	27 : {name : "梅花A", type : "diamonds", point :14 , next : 28, prev : 39},
	28 : {name : "梅花2", type : "diamonds", point : 20, prev : 27},
	29 : {name : "梅花3", type : "diamonds", point : 3, next : 30},
	30 : {name : "梅花4", type : "diamonds", point : 4, next : 31, prev : 29},
	31 : {name : "梅花5", type : "diamonds", point : 5, next : 32, prev : 30},
	32 : {name : "梅花6", type : "diamonds", point : 6, next : 33, prev : 31},
	33 : {name : "梅花7", type : "diamonds", point : 7, next : 34, prev : 32},
	34 : {name : "梅花8", type : "diamonds", point : 8, next : 35, prev : 33},
	35 : {name : "梅花9", type : "diamonds", point : 9, next : 36, prev : 34},
	36 : {name : "梅花10", type : "diamonds", point : 10, next : 37, prev : 35},
	37 : {name : "梅花J", type : "diamonds", point : 11, next : 38, prev : 36},
	38 : {name : "梅花Q", type : "diamonds", point : 12, next : 39, prev : 37},
	39 : {name : "梅花K", type : "diamonds", point : 13, next : 40, prev : 27},
	40 : {name : "方块A", type : "clubs", point :14 , next : 41, prev : 52},
	41 : {name : "方块2", type : "clubs", point : 20, prev : 40},
	42 : {name : "方块3", type : "clubs", point : 3, next : 43},
	43 : {name : "方块4", type : "clubs", point : 4, next : 44, prev : 42},
	44 : {name : "方块5", type : "clubs", point : 5, next : 45, prev : 43},
	45 : {name : "方块6", type : "clubs", point : 6, next : 46, prev : 44},
	46 : {name : "方块7", type : "clubs", point : 7, next : 47, prev : 45},
	47 : {name : "方块8", type : "clubs", point : 8, next : 48, prev : 46},
	48 : {name : "方块9", type : "clubs", point : 9, next : 49, prev : 47},
	49 : {name : "方块10", type : "clubs", point : 10, next : 50, prev : 48},
	50 : {name : "方块J", type : "clubs", point : 11, next : 51, prev : 49},
	51 : {name : "方块Q", type : "clubs", point : 12, next : 52, prev : 50},
	52 : {name : "方块K", type : "clubs", point : 13, next : 40, prev : 51},
	53 : {name : "小王", type : "joker", point : 30, next : 54},
	54 : {name : "大王", type : "joker", point : 40, prev : 53}
};

module.exports.getCards = function(){
	return gdyutil.cloneObject(thecards);
}

module.exports.findCards = function(name){
	for( var card in thecards )
		if( thecards[card].name == name )
			return gdyutil.cloneObject(thecards[card]);
	return undefined;
}

module.exports.shuffle = function(cards){
	var temp_array, result=[], pos, element_cnt, temp_array1=[];
	for(var i in cards){
		temp_array1.push(cards[i]);
	}

	for( element_cnt =cards.length; element_cnt>0; element_cnt--){
		pos = Math.floor(Math.random() * element_cnt);
		result.push(temp_array1[pos]);
		delete temp_array1[pos];

		temp_array = [];
		for(pos in temp_array1)
			temp_array.push(temp_array1[pos]);

		for(pos in temp_array )
			temp_array1[pos] = temp_array[pos];
	}
	return result;
}

var card_type = {
	single : "single",
	one_pair : "one_pair",
	two_pairs : "two_pairs",
	straight : "straight",
	three : "three of a kind",
	bomb : "bomb",
	king_bomb : "king bomb",
};

function countKingCount(cards){
	var count = 0;
	for(suit in cards){
		if( cards[suit].type == "joker" )
			count ++;
	}
	return count;
}

module.exports.countKingCount = countKingCount;

function hasTwoCards( cards ){
	var ret = false;
	for( var card in cards )
		if( cards[card].point == 15 )
			ret = true;

	return ret;
}

module.exports.getSuits = function(cards){
	var ret = [];
	if( cards.length <=0 || cards.length > 4 )
		return ret;
	var mycard = gdyutil.cloneObject(thecards);

	cards = cards.sort(function(a, b){
		if( a.point < b.point )
			return -1;
		else if( a.point == b.point )
			return 0;
		else
			return 1;
		}
	);

	var suit = { cards : [] };

	switch(cards.length){
		case 1: // 单牌。单张王不是任何牌型。
			if( cards[0].type != "joker" ){
				suit.card_type = card_type.single;
				suit.cards.push(cards[0]);
				ret.push(suit);
			}
			break;
		case 2: // 二张牌。双王, 对子。
			switch( countKingCount(cards) ){
				case 0:
					if( cards[0].point == cards[1].point ){ // 对子
						suit.card_type = card_type.one_pair;
						suit.cards.push(cards[0], cards[1]);
						ret.push(suit);
					}
					break;
				case 1:
					// 对子
					suit.card_type = card_type.one_pair;
					suit.cards.push(cards[0], cards[0]);
					ret.push(suit);
					break;
				case 2:
					// 王炸
					suit.card_type = card_type.king_bomb;
					suit.cards.push(cards[0], cards[1]);
					ret.push(suit);
					break;
			}
			break;
		case 3:	 //  三张、顺子。2不能出现在顺子中。
			switch( countKingCount(cards) ){
				case 0 :
					if( !hasTwoCards( cards ) && cards[0].point + 1 == cards[1].point // 顺子。不能有2
						&& cards[1].point + 1 == cards[2].point){
						suit.card_type = card_type.straight;
						suit.cards.push(cards[0], cards[1], cards[2]);
						ret.push(suit);
					}
					else if( cards[0].point == cards[1].point // 三张相同点数的牌
						&& cards[1].point == cards[2].point){
						suit.card_type = card_type.three;
						suit.cards.push(cards[0], cards[1], cards[2]);
						ret.push(suit);
					}
					break;
				case 1 : // 一张王
					if( cards[0].point + 1 == cards[1].point ){ // 两张牌点数相邻
						if( cards[0].point == 3 ){ // 王只能放在右边，构成顺子
							suit.card_type = card_type.straight;
							suit.cards.push(cards[0], cards[1],  mycard[cards[1].next]);
							ret.push(suit);
						}
						else if( cards[1].point == 14 ){
							// 王只能放在左边构成顺子
							suit.card_type = card_type.straight;
							suit.cards.push(mycard[cards[0].prev], cards[1], cards[2]);
							ret.push(suit);
						}
						else if(cards[1].point <= 13){ // 王可以在两边，组成两种顺子
							suit.card_type = card_type.straight;
							suit.cards.push(mycard[[cards[0].prev]], cards[0], cards[1]);
							ret.push(suit);
							
							suit = { card_type : card_type.straight, cards : [cards[0], cards[1], mycard[cards[1].next]] };
							ret.push(suit);
						}
					}
					else if( cards[0].point + 2 == cards[1].point ){ // 两张牌点数相关2, 这时只能把王放中间构成顺子
							suit.card_type = card_type.straight;
							suit.cards.push(cards[0], mycard[cards[0].next], cards[1]);
							ret.push(suit);
					}
					else if( cards[0].point == cards[1].point ){ // 两张一样点数的牌和张王构成三张
						suit.card_type = card_type.three;
						suit.cards.push(cards[0], cards[1], cards[0]);
						ret.push(suit);
					}
					break;
				case 2 : // 两个王
					// 必然构成一个三张
					suit.card_type = card_type.three;
					suit.cards.push(cards[0], cards[0], cards[0]);
					ret.push(suit);
				
					if( cards[0].point == 3 ){ // 只包含一张最开始普通牌，两个王只能放到最后构成一种合法牌型
						suit = { card_type : card_type.straight, cards : [] };
						suit.cards.push(cards[0], mycard[cards[0].next], mycard[mycard[cards[0].next].next]);
						ret.push(suit);
					}
					else if( cards[0].point == 4 // 两种合法牌型。 
						|| cards[0].point == 13 ){
						suit = { card_type : card_type.straight, cards : [] };
						suit.cards.push(mycard[cards[0].prev], cards[0], mycard[cards[0].next]);
						ret.push(suit);
						
						suit = { card_type : card_type.straight, cards : [] };
						suit.cards.push(cards[0], mycard[cards[0].next], mycard[mycard[cards[0].next].next]);
						ret.push(suit);
					}
					else if( cards[0].point == 14 ){// 一种合法牌型
						suit = { card_type : card_type.straight, cards : [] };
						suit.cards.push(cards[0], mycard[cards[0].prev], mycard[mycard[cards[0].prev].prev]);
						ret.push(suit);
					}
					else{ //三种合法牌型
						if( !hasTwoCards(cards)){
							suit = { card_type : card_type.straight, cards : [] };
							suit.cards.push(mycard[mycard[cards[0].prev].prev], mycard[cards[0].prev], cards[0]);
							ret.push(suit);

							suit = { card_type : card_type.straight, cards : [] };
							suit.cards.push(mycard[cards[0].prev], cards[0], mycard[cards[0].next]);
							ret.push(suit);
							
							suit = { card_type : card_type.straight, cards : [] };
							suit.cards.push( cards[0], mycard[cards[0].next], mycard[mycard[cards[0].next].next]);
							ret.push(suit);
						}
					}
					break;
			}
			
			break;
		case 4:
			// 连对, 炸弹。2不能出现在连对中。
			switch(countKingCount(cards)){
				case 0: // 没有王牌
					if( cards[0].point == cards[1].point // 四张牌一样，是炸弹
						&& cards[1].point == cards[2].point
						&& cards[2].point == cards[3].point){

						suit.card_type = card_type.bomb;
						suit.cards.push(cards[0], cards[1], cards[2], cards[3]);
						ret.push(suit);
					}
					else if( !hasTwoCards(cards)  // 连对
						&& cards[0].point == cards[1].point
						&& cards[2].point == cards[3].point
						&& cards[1].point + 1 == cards[2].point){

						suit.card_type = card_type.two_pairs;
						suit.cards.push(cards[0], cards[1], cards[2], cards[3]);
						ret.push(suit);
					}
					break;
				case 1: // 有一张王牌
					if( !hasTwoCards(cards)  // 三张一样的牌和一张王牌和王组成炸弹
						&&cards[0].point == cards[1].point
						&& cards[1].point == cards[2].point
						&& cards[2].point == cards[3].point){

							suit.card_type = card_type.bomb;
							suit.cards.push(cards[0], cards[1], cards[2], cards[0]);
							ret.push(suit);
					}
					else if( !hasTwoCards(cards)) { //连对
						if( cards[0].point == cards[1].point
							&& cards[0].point + 1 == cards[2].point){
							suit.card_type = card_type.two_pairs;
							suit.cards.push(cards[0], cards[1], cards[2], cards[2]);
							ret.push(suit);
						}
						else	if( cards[1].point == cards[2].point
							&& cards[0].point + 1 == cards[1].point ){//连对
							suit.card_type = card_type.two_pairs;
							suit.cards.push(cards[0], cards[0], cards[1], cards[2]);
							ret.push(suit);
						}
					}
					break;
				case 2: // 有两张王牌
					if( cards[0].point == cards[1].point ){ // 剩余两张牌相同是炸弹
						suit.card_type = card_type.bomb;
						suit.cards.push(cards[0], cards[1], cards[0], cards[1]);
						ret.push(suit);
					}
					else if( !hasTwoCards(cards)
								&& cards[0].point + 1 == cards[1].point ){// 两张牌相连是连对
						suit.card_type = card_type.two_pairs;
						suit.cards.push(cards[0], cards[0], cards[1], cards[1]);
						ret.push(suit);
					}
					break;
				default:
					
					break;
			}
			break;
	}

	return ret;
}
