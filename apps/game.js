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
			}
		});

		socket.on('endTurn', function () {
			var sId = id(socket.id);
			var nextPlayer = sId === player1 ? player2 : player1;

			if (sId === player2) {
				turnNum++;
			}

			console.log(nextPlayer + ' is starting turn ' + turnNum);

			game.emit('newTurn', {
				turnPlayer: nextPlayer,
				turnNum: turnNum
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
			delete room.players[sId].cards[data.id];

			room.players[sId].board[data.id] = data;
			game.emit('cardPlayed', data);
		});
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
