var game = require('./game');
var id = require('./util/idHandler');

var rooms = {};
var players = {};

var createLobby = function(socket, io) {
	socket.on('createRoom', function(data) {
		var sId = id(socket.id);

		if (data.roomName === '' || rooms.hasOwnProperty(data.roomName)) {
			socket.emit('createdRoom', {
				id: sId,
				name: data.name,
				success: false,
				message: 'Room already exists'
			});
		} else {
			rooms[data.roomName] = {
				players: {},
				roomName: data.roomName
			};

			rooms[data.roomName].players[sId] = {
				name: data.name,
				roomName: data.roomName,
				ready: false
			};

			players[sId].room = data.roomName;

			socket.emit('createdRoom', {
				id: sId,
				name: data.name,
				roomName: data.roomName,
				success: true,
				players: rooms[data.roomName].players
			});

			console.log(data.name + ' created room ' + data.roomName);
		}
	});

	socket.on('joinRoom', function(data) {
		var sId = id(socket.id);

		if (rooms.hasOwnProperty(data.roomName) && !rooms[data.roomName].players.hasOwnProperty(sId)) {
			rooms[data.roomName].players[sId] = {
				name: data.name,
				roomName: data.roomName,
				ready: false
			};

			players[sId].room = data.roomName;

			io.emit('joinedRoom', {
				id: sId,
				name: data.name,
				roomName: data.roomName,
				success: true,
				players: rooms[data.roomName].players
			});

			console.log(data.name + ' joined room ' + data.roomName);
		} else {
			socket.emit('joinedRoom', {
				id: sId,
				name: data.name,
				success: false,
				message: 'Room does not exist'
			});
		}
	});

	socket.on('ready', function(data) {
		var sId = id(socket.id);
		var name = players[sId].name;

		console.log(name + ' is ready');

		var roomName = players[sId].room;
		var room = rooms[roomName];

		io.emit('ready', {
			id: sId,
			roomName: roomName
		});

		room.players[sId].ready = true;

		console.log(room);

		var allReady = true;
		var count = 0;

		if (Object.keys(room.players).length > 1) {
			for (var playerId in room.players) {
				if (room.players.hasOwnProperty(playerId)) {
					var player = room.players[playerId];
					count++;
					console.log('count: ' + count);
					if (!player.ready) {
						console.log(player.name + ' not ready');
						allReady = false;
						break;
					}
				}
			}

			if (count < 2) {
				allReady = false;
			}

			if (allReady) {
				startRoom(room);
			}
		}
	});

	function startRoom(room) {
		room.game = game(io, room);
	}

	return {
		addPlayer: function(playerId, name) {
			players[playerId] = {
				name: name
			};
			console.log(players);
			console.log(rooms);
		},
		removePlayer: function(playerId) {
			if (players[playerId].room) {
				delete rooms[players[playerId].room].players[playerId];
				if (Object.keys(rooms[players[playerId].room].players).length === 0) {
					delete rooms[players[playerId.room]];
				}
			}
			delete players[playerId];
			console.log(players);
			console.log(rooms);
		}
	};
};

module.exports = createLobby;
