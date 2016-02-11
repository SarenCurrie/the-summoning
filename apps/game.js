var _ = require('underscore');
var iconMapper = require('./util/iconMapper');
var id = require('./util/idHandler');
var cards = require('./gamedata/cards');
var uuid = require('node-uuid');

var createGame = function (io, room) {
	console.log('creating namespace ' + room.roomName);

	var game = io.of(room.roomName);
	var facesRecieved = false;
	var relicRequirement = [10,15,20,30,40]
	var turnNum = 0;
	var player1;
	var player2;
	var currentPlayer;

	game.on('connection', function (socket) {
		var sId = id(socket.id);

		console.log(sId + ' joined ' + room.roomName);

		room.players[sId].ready = false;
		room.players[sId].cards = {};
		room.players[sId].board = {};
		room.players[sId].relics = 0;
		room.players[sId].facedamage = 0;
		room.players[sId].faces = null;
		room.players[sId].deck = [];
		room.players[sId].mullcards = [];

		var cardSet = cards({
			summonCard: function (summoner, summonee) {
				console.log('summoning...');

				var pId = summoner.player;
				var cardId = uuid.v4();
				var card = {};

				if (_.size(room.players[pId].board) > 7) {
					return;
				}

				_.extend(card, summonee, {player: pId, id: cardId});

				room.players[pId].board[cardId] = card;

				game.emit('cardPlayed', card, 0);
			},
			killCard: function (card) {
				console.log('Killing card: ' + card.name);

				delete room.players[card.player].board[card.id];
				game.emit('cardKilled', card);
			},
			changeCard: function (card) {
				console.log('Changing card: ' + card.name);
				console.log(card)
				game.emit('cardChanged', card);
			},
			draw: function (card) {
				console.log('Card forcing draw!');
				drawCard(card);
				console.log('Done!');
			}
		});

		// console.log('Printing the deck!')
		// console.log(_.size(cardSet));
		// console.log(cardSet)
		//this is kind of a patchy fix for players also being minions. TODO!
		for (var i = 0; i < 30; i++){
			while (true){
				var num = Math.floor(Math.random() * (_.size(cardSet)));
				var count = 0;
				var cardFound = false;
				for (var key in cardSet) {
					if (count == num){
					if (cardSet[key].type == 'player'){
						break
					}
					if (cardSet[key].name == 'Sleeping Statue'){
						break
					}
					var cardId = uuid.v4();
					var card = {};
					_.extend(card, cardSet[key], {player: sId, id: cardId});
					room.players[sId].deck[i]  = card;
					cardFound = true;
				}
				count += 1;
				}
				if (cardFound == true){
					if (i < 3){
						room.players[sId].mullcards[i] = room.players[sId].deck[i].id
					}
					break
				}
			}
		}
		console.log('printing deck!')
		console.log(room.players[sId].deck)
		console.log(_.size(room.players[sId].deck))

		if (!player1) {
			player1 = sId;
			var cardId = uuid.v4();
			var card = {};
			_.extend(card, cardSet.player1, {player: sId, id: cardId});
			room.players[sId].board[cardId] = card;
			room.players[sId].faces = card;
		}
		else {
			player2 = sId;
			var cardId = uuid.v4();
			var card = {};
			_.extend(card, cardSet.player2, {player: sId, id: cardId});
			room.players[sId].board[cardId] = card;
			room.players[sId].faces = card;
			console.log('starting game');
			game.emit('newTurn', {
				room: room,
				turnPlayer: player1,
				turnNum: turnNum
			});
		}

		socket.on('endTurn', function () {
			var sId = id(socket.id);
			var nextPlayer = sId === player1 ? player2 : player1;
			console.log('EoT');
			for (var key in room.players[sId].board) {
				room.players[sId].board[key].endOfTurn(room);
			}
			if (sId === player2) {
				turnNum++;
			}
			room.players[nextPlayer].mana = turnNum;

			console.log(nextPlayer + ' is starting turn ' + turnNum);
			console.log('SoT');
			for (var key in room.players[nextPlayer].board) {
				room.players[nextPlayer].board[key].startOfTurn(room);
			}

			refresh(nextPlayer)

			game.emit('newTurn', {
				turnPlayer: nextPlayer,
				turnNum: turnNum,
				mana: room.players[nextPlayer].mana
			});
		});

		function pickRandomProperty(obj) {
			var result;
			var count = 0;
			for (var prop in obj) {
				if (Math.random() < 1/++count) {
					result = prop;
				}
			}
			return obj[result];
		}

		function drawCard(data) {
			var tempsID
			if (data){
				tempsID = data.player
			} else {
				tempsID = sId
			}
			console.log('player ' + tempsID + ' draws');
			if (_.size(	room.players[tempsID].cards) < 10) {
				var card = room.players[tempsID].deck.shift();
				console.log('deck size is');
				console.log(_.size(room.players[tempsID].deck));
				room.players[tempsID].cards[card.id] = card;

				socket.emit('cardDrawn', card);
				game.emit('updateSize', tempsID, _.size(room.players[tempsID].deck));
			}
			else {
				console.log('card "burnt"');
			}
		}

		socket.on('drawCard', function (data) {
			drawCard(data);
		});

		function refresh (nextPlayer) {
			console.log('refresh ' + nextPlayer);
			// console.log(room.players[nextPlayer]);
			for (var key in room.players[nextPlayer].board) {
				room.players[nextPlayer].board[key].attacks = 1;
			}
		}

		socket.on('mulliganCard', function (data) {
			if (_.contains(room.players[sId].mullcards,data.id)){
			console.log(sId + ' mulliganed ' + data.name);
			console.log(room.players[sId].deck);
			while (true) {
				var num = Math.floor(Math.random() * (_.size(room.players[sId].deck)));
				console.log('random num: ' + num);
				if (room.players[sId].deck[num].type != 'player'){
					break;
				}
			}
			var temp = room.players[sId].cards[data.id];
			var card = room.players[sId].deck[num];
			room.players[sId].cards[card.id] = card;
			room.players[sId].deck[num] = temp;
			delete room.players[sId].cards[data.id];
			socket.emit('cardMulliganed', data);
			socket.emit('cardDrawn', card);
			game.emit('updateSize', sId, _.size(room.players[sId].deck));
		} else {
			console.log('Can\'t mulligan a card you just recieved');
		}
		});

		socket.on('playCard', function (data, target) {

			if (_.size(room.players[sId].board) > 7) {
				return;
			}

			if (room.players[sId].mana < room.players[sId].cards[data.id].mana) {
				return;
			}

			room.players[sId].mana -= room.players[sId].cards[data.id].mana;
			var mana = room.players[sId].mana;
			room.players[sId].board[data.id] = room.players[sId].cards[data.id];
			delete room.players[sId].cards[data.id];

			game.emit('cardPlayed', data, mana);

			if (target) {
				activateBR(data, target);
			}

		});

		socket.on('getBoardSize',  function(data) {
			console.log('here we go');
			if (data.player == player1){
				socket.emit('boardSize', _.size(room.players[data.player].board), _.size(room.players[player2].board), data);
			} else {
				socket.emit('boardSize', _.size(room.players[player2].board), _.size(room.players[data.player].board), data);
			}

		});

		socket.on('getFaces',  function() {
			if (!facesRecieved){
				facesRecieved = true;
				for (var key in room.players) {
					game.emit('cardPlayed', room.players[key].faces, 0);
				}
			}
		});

		function activateBR(card, target) {
			console.log("activating BR");
			console.log(card);
			console.log(target);
			console.log('check card on board');
			console.log(room.players[card.player].board[card.id]);
			console.log('check target on board')
			console.log(room.players[target.player].board[target.id]);
			room.players[card.player].board[card.id].battleRattle(room, room.players[target.player].board[target.id]);
		}

		socket.on('attack', function(attacker, victim) {
			console.log('attacking');
			console.log(attacker);
			console.log('victim');
			console.log(victim);
			if (room.players[sId].board[attacker.id]) {
				if (room.players[sId].board[attacker.id].attacks == 0) {
					console.log("This minion can't attack!")
					return;
				}
				if (room.players[sId].board[victim.id]) {
					console.log("Can't attack your own minions!");
					return;
				}
				if (room.players[sId].board[attacker.id].type == 'player'){
					console.log(room.players[sId].board[attacker.id].type)
					console.log("Can't attack with your own face! How did you even gain attack?");
					return;
				}
				if (room.players[victim.player].board[victim.id].type == 'player'){
					if (_.size(room.players[victim.player].board) > 1){
						console.log("You must clear the board before going face!");
						return;
					} else {
						room.players[sId].facedamage += room.players[sId].board[attacker.id].damage
						while (room.players[sId].facedamage > relicRequirement[room.players[sId].relics]){
							room.players[sId].facedamage -= relicRequirement[room.players[sId].relics]
							room.players[sId].relics += 1
							console.log('relic earned!')
							game.emit('relicEarned', sId, room.players[sId].relics);
							if (room.players[sId].relics >= 5){
								game.emit('gameOver', sId)
							}
						}
						game.emit('faceDamageEarned', sId, room.players[sId].facedamage)
						room.players[sId].board[attacker.id].attacks -= 1;
						return;
					}
				}

				room.players[sId].board[attacker.id].attacks -= 1;
				room.players[sId].board[attacker.id].attack(room, room.players[victim.player].board[victim.id]);
			} else {
				console.log("This minion doesn't belong to you!");
			}
		});
	});

	console.log('started');

	io.emit('roomStarted', {
		roomName: room.roomName,
		players: room.players
	});
}

module.exports = createGame;
