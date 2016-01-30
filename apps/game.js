var _ = require('underscore');
var iconMapper = require('./util/iconMapper');
var id = require('./util/idHandler');
var cards = require('./gamedata/cards');
var uuid = require('node-uuid');

var createGame = function (io, room) {
	console.log('creating namespace ' + room.roomName);

	var game = io.of(room.roomName);
	var facesRecieved = false;
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

		var cardSet = cards({
			killCard: function (card) {
				console.log('Killing card: ' + card.name);

				delete room.players[card.player].board[card.id];
				game.emit('cardKilled', card);
			}
		});

		console.log('Printing the deck!')
		console.log(_.size(cardSet));
		console.log(cardSet)
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
					var cardId = uuid.v4();
					var card = {};
					_.extend(card, cardSet[key], {player: sId, id: cardId});
					room.players[sId].deck[i]  = card;
					cardFound = true;
				}
				count += 1;
				}
				if (cardFound == true){
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

			if (sId === player2) {
				turnNum++;
			}
			room.players[nextPlayer].mana = turnNum;

			console.log(nextPlayer + ' is starting turn ' + turnNum);

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

		socket.on('drawCard', function () {
			console.log('player ' + sId + ' draws');
			var card = room.players[sId].deck.shift();
			console.log('deck size is');
			console.log(_.size(room.players[sId].deck));
			room.players[sId].cards[card.id] = card;

			socket.emit('cardDrawn', card);
			game.emit('updateSize', sId, _.size(room.players[sId].deck));
		});

		function refresh (nextPlayer) {
			console.log('refresh ' + nextPlayer);
			// console.log(room.players[nextPlayer]);
			for (var key in room.players[nextPlayer].board) {
  		room.players[nextPlayer].board[key].attacks = 1;
			}
		}

		socket.on('mulliganCard', function (data) {
			console.log(sId + ' mulliganed ' + data.name);
			while (true) {
			var num = Math.floor(Math.random() * (_.size(room.players[sId].deck)));
			if (room.players[sId].deck[num].type != 'player'){
				break
			}
			}
			var temp = room.players[sId].cards[data.id]
			delete room.players[sId].cards[data.id];
			socket.emit('cardMulliganed', data);
			var card = room.players[sId].deck[num]
			room.players[sId].cards[card.id] = card;
			room.players[sId].deck[num] = temp;
			socket.emit('cardDrawn', card);
			game.emit('updateSize', sId, _.size(room.players[sId].deck));
		});

		socket.on('playCard', function (data) {
			console.log(sId + ' played ' + data.name);
			console.log(data)
			console.log(data.id)
			console.log(room.players[sId].mana)
			for (var key in room.players[sId].cards) {
				console.log('key is')
				console.log(key)
				console.log(room.players[sId].cards[key])
			}
			console.log(room.players[sId].cards[data.id])
			console.log(room.players[sId].cards[data.id].mana)
			if (room.players[sId].mana >= room.players[sId].cards[data.id].mana) {
				room.players[sId].mana -= room.players[sId].cards[data.id].mana;
				var mana = room.players[sId].mana;

				room.players[sId].board[data.id] = room.players[sId].cards[data.id];
				delete room.players[sId].cards[data.id];

				game.emit('cardPlayed', data, mana);
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

		socket.on('attack', function(attacker, victim) {
			if (room.players[sId].board[attacker.id].attacks == 0) {
				console.log("This minion can't attack!")
				return;
			}
			console.log("attacking");
			console.log(attacker);
			console.log("victim");
			console.log(victim);
			if (room.players[sId].board[attacker.id]) {
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
						while (room.players[sId].facedamage > 1){
							room.players[sId].relics += 1
							room.players[sId].facedamage -= 2
							console.log('relic earned!')
							game.emit('relicEarned', sId, room.players[sId].relics);
						}
						game.emit('faceDamageEarned', sId, room.players[sId].facedamage)
						room.players[sId].board[attacker.id].attacks -= 1;
						return;
					}
				}

				room.players[sId].board[attacker.id].attacks -= 1;
				room.players[sId].board[attacker.id].attack(room, room.players[victim.player].board[victim.id]);
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
