var _ = require('underscore');
var iconMapper = require('./util/iconMapper');
var id = require('./util/idHandler');
var cards = require('./gamedata/cards');
var uuid = require('node-uuid');

var createGame = function (io, room) {
	console.log('creating namespace ' + room.roomName);

	var game = io.of(room.roomName);

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

		if (!player1) {
			player1 = sId;
		}
		else {
			player2 = sId;
			console.log('starting game');
			game.emit('newTurn', {
				room: room,
				turnPlayer: player1,
				turnNum: turnNum
			});
		}

		var cardSet = cards({
			killCard: function (card) {
				console.log('Killing card: ' + card.name);

				delete room.players[card.player].board[card.id];
				game.emit('cardKilled', card);
			}
		});

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

			var cardId = uuid.v4();

			var card = {};
			_.extend(card, cardSet.dean, {player: sId, id: cardId});

			room.players[sId].cards[cardId] = card;

			socket.emit('cardDrawn', card);
		});

		function refresh (nextPlayer) {
			console.log('refresh ' + nextPlayer);
			console.log(room.players[nextPlayer]);
			for (var key in room.players[nextPlayer].board) {
  		room.players[nextPlayer].board[key].attacks = 1;
			}
		}

		socket.on('mulliganCard', function (data) {
			console.log(sId + ' mulliganed ' + data.name);
			delete room.players[sId].cards[data.id];
			socket.emit('cardMulliganed', data);
			var cardId = uuid.v4();

			var card = {};
			_.extend(card, cardSet.dean, {player: sId, id: cardId});

			room.players[sId].cards[cardId] = card;

			socket.emit('cardDrawn', card);
		});

		socket.on('playCard', function (data) {
			console.log(sId + ' played ' + data.name);

			if (room.players[sId].mana >= room.players[sId].cards[data.id].mana) {
				room.players[sId].mana -= room.players[sId].cards[data.id].mana;
				var mana = room.players[sId].mana;

				room.players[sId].board[data.id] = room.players[sId].cards[data.id];
				delete room.players[sId].cards[data.id];

				game.emit('cardPlayed', data, mana);
			}
		});

		socket.on('attack', function(attacker, victim) {
			if (room.players[sId].board[attacker.id].attacks == 0) {
				console.log("This minion can't attack!")
				return;
			}
			console.log("attacking");
			console.log(attacker);
			console.log(victim);
			if (room.players[sId].board[attacker.id]) {
				if (room.players[sId].board[victim.id]) {
					console.log("Can't attack your own minions!");
					return;
				}
				room.players[sId].board[attacker.id].attacks -= 1;
				room.players[sId].board[attacker.id].attack(room, room.players[victim.player].board[victim.id]);
			}

		})
	});

	console.log('started');

	io.emit('roomStarted', {
		roomName: room.roomName,
		players: room.players
	});
}

module.exports = createGame;

/*

var cardSet = cards({
	killCard: function (card) {
		console.log('Killing card: ' + card.name);
	}
});

socket.on('drawCard', function () {
	console.log('player ' + sId + ' draws');
	var card = {};
	_.extend(card, cardSet.dean, {player: sId});

	players[sId].card = card;

	socket.emit('cardDrawn', card);
});

socket.on('endTurn', function (data) {
	var sId = id(socket.id);

	room.players[sId].ready = true;

	game.emit('turnReady', {
		id: sId
	});
});

*/
