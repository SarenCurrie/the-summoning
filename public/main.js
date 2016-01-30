Number.isInteger = Number.isInteger || function(value) {
  return typeof value === "number" &&
    isFinite(value) &&
    Math.floor(value) === value;
};

$(function () {
	$('#submit_name').on('click', function () {
		if ($('#name').val().trim() !== '') {
			var name = $('#name').val();
			$('body').html('');
			$('body').html(template('main'));
			nameReady(name);
		}
	});
});

var nameReady = function(name) {
	var socket = io();
	var socketId;

	socket.emit('joinServer', {
		name: name
	});

	var currentRoom;

	socket.on('chatMessage', function(data) {
		$('.chat-box').append('<p>' + data.name + ': ' + data.message);
	});

	socket.on('createdRoom', function(data) {
		console.log(data);
		if (data.id === socket.id && data.success) {
			currentRoom = data.roomName;
			renderRoom(data);
		}
	});

	socket.on('joinedRoom', function(data) {
		if (data.id === socket.id && data.success) {
			currentRoom = data.roomName;
			console.log(data);
			renderRoom(data);
		} else if (data.roomName === currentRoom) {
			$('#players').append('<li id="player_' + data.id + '">' + data.name + '</li>')
		}
	});

	function renderRoom(data) {
		$('#main_container').html(template('room', {roomName: data.roomName, players: data.players, playerId: data.id}));

		$('#ready_btn').on('click', function () {
			console.log('clicked');
			socket.emit('ready');
			$('#ready_btn').remove();
		});
	}

	socket.on('ready', function (data) {
		console.log('ready: ' + data.id);
		if (data.roomName === currentRoom) {
			console.log($('#player_' + data.id));
			$('#player_' + data.id).append(' <i class="fa fa-check"></i>');
		}
	});

	$('#chat').on('keydown', function (e) {
		var message = $('#chat').val();

		if (e.which === 13 && message) {
			socket.emit('chatMessage', {
				name: name,
				message: message
			});

			$('#chat').val('');
			$('.chat-box').append('<p>' + name + ': ' + message);
		}
	});

	$('#join_room').on('click', function () {
		var roomName = $('#room_name').val();

		socket.emit('joinRoom', {
			name: name,
			roomName: roomName
		});
	});

	$('#create_room').on('click', function () {
		var roomName = $('#room_name').val();

		console.log('creating room');

		socket.emit('createRoom', {
			name: name,
			roomName: roomName
		});
	});

	socket.on('roomStarted', function (data) {
		console.log(data.roomName);

		if (data.roomName === currentRoom) {
			joinGame(data);
		}
	})

	function joinGame(roomData) {
		console.log('joining namespace ' + roomData.roomName);
		var game = io('/' + roomData.roomName);

		game.on('newTurn', function (data) {
			console.log('starting game');
			console.log(data.room);

			if (data.turnPlayer === socket.id) {
				console.log('It is this palyers turn!');
				if(data.turnNum === 0) {
					// insert game template
					$('#room').html(template('game', roomData));

					console.log('sending drawCard message');
					game.emit('drawCard');
					game.emit('drawCard');
					game.emit('drawCard');
				}
				else {
					game.emit('drawCard');
				}
				$('#end_turn').on('click', function () {
					$('.card').off('click');
					$('#end_turn').off('click');
					game.emit('endTurn');
				});
			}
		});

		game.on('cardDrawn', function (data) {
			console.log('card drawn');
			console.log(data);

			$('.player-hand').append(template('card', data));

			$('#' + data.id).on('click', function () {
				console.log('clicked card');
				game.emit('mulliganCard', data);
			});
		});

		game.on('cardMulliganed', function (data) {
			$('#' + data.id).remove();
		})

		game.on('joinedRoom', function (data) {
			console.log(data.roomName);
		});
	}
};
