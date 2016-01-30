var _ = require('underscore');
var iconMapper = require('./util/iconMapper');
var id = require('./util/idHandler');
var cards = require('./gamedata/cards');

var createGame = function (io, room) {
	console.log('creating namespace ' + room.roomName);

	var game = io.of(room.roomName);

	var numPlayers = 0;

	game.on('connection', function (socket) {
		var sId = id(socket.id);

		console.log(sId + ' joined ' + room.roomName);

		room.players[sId].ready = false;

		numPlayers++;
		if (numPlayers === Object.keys(room.players).length) {
			console.log('starting game');
			game.emit('newTurn', {
				room: room,
				turnNum: 1
			});
		}

		var cardSet = cards({
			killCard: function (card) {
				console.log('Killing card: ' + card.name);
			}
		});

		socket.on('drawCard', function () {
			console.log('player ' + sId + ' draws');

			var card = {};
			_.extend(card, cardSet.dean, {player: sId});

			room.players[sId].card = card;

			socket.emit('cardDrawn', card);
		});

		socket.on('endTurn', function (data) {
			var sId = id(socket.id);

			room.players[sId].ready = true;

			game.emit('turnReady', {
				id: sId
			});
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
