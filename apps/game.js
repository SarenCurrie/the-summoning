var _ = require('underscore');
var iconMapper = require('./util/iconMapper');
var id = require('./util/idHandler');
var buildings = require('./gamedata/buildings');

var createGame = function (io, room) {
	console.log('creating namespace ' + room.roomName);

	var game = io.of(room.roomName);

	var numPlayers = 0;

	game.on('connection', function (socket) {
		var sId = id(socket.id);

		console.log(sId + ' joined ' + room.roomName);

		room.players[sId].ready = false;

		var players = room.players;

		socket.emit('joinedRoom', {
			roomName: room.roomName
		});

		numPlayers++;
		if (numPlayers === Object.keys(players).length) {
			console.log('starting game');
			game.emit('newTurn', {
				room: room,
				turnNum: 1
			});
		}

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
