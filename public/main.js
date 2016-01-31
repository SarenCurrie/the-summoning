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
	});

	var turnNum;
	var turnPlayer;
	var selected;

	var cardDoingBattleRattle;

	// Normal, InBattleRattle, InAttack
	var cardActionState = 'Normal';

	function joinGame(roomData) {
		console.log('joining namespace ' + roomData.roomName);
		var game = io('/' + roomData.roomName);

		game.on('newTurn', function (data) {
			turnNum = data.turnNum;
			turnPlayer = data.turnPlayer;
			console.log('starting new turn');
			console.log(data.mana);
			$('#mana').text(data.mana);
			if (turnPlayer === socket.id) {
				console.log('It is this players turn!');
				if(turnNum === 1){
					game.emit('getFaces');
				}
				if(turnNum === 0) {
					console.log('starting game');

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
					$('#end_turn').off('click');
					game.emit('endTurn');
				});
			}
		});

		game.on('updateSize', function (sId, value) {
			if (sId === socket.id) {
				$('#player_cards_in_deck').text(value);
			}
			else {
				$('#opponent_cards_in_deck').text(value);
			}
		});

		game.on('cardDrawn', function (data) {
			console.log('card drawn');
			console.log(data);

			if (!data.image) {
				data.image = 'DEMON.png'
			}

			$('.player-hand').append(template('card', data));

			$('#' + data.id).on('click', function () {
				console.log('clicked card');
				if (cardActionState === 'Normal') {
					if (turnPlayer === socket.id) {
						if (turnNum === 0) {
							console.log(data);
							game.emit('mulliganCard', data);
						} else {
							if (data.battleRattleTarget) {
								cardActionState = 'InBattleRattle';
								cardDoingBattleRattle = data;
							}
							else {
								game.emit('playCard', data);
							}
						}
					}
				}
			});
		});

		game.on('cardMulliganed', function (data) {
			$('#' + data.id).remove();
		});

		game.on('relicEarned', function (sId, value) {
			if (sId === socket.id) {
				$('#player_ritual_pieces').text(value);
			}
			else {
				$('#opponent_ritual_pieces').text(value);
			}
		});

    game.on('gameOver', function (sId, value) {
      if (sId === socket.id) {
        alert("You won! Congratulations!");
      }
      else {
        alert("You lose! Better luck next time!");
      }
    });

		game.on('faceDamageEarned', function (sId, value) {
			if (sId === socket.id) {
				$('#player_face_damage').text(value);
			}
			else {
				$('#opponent_face_damage').text(value);
			}
		});

		game.on('cardPlayed', function (data, mana) {
			console.log('cardPlayed');
			console.log(data);
			var $board;
			$('#mana').text(mana);
			if (data.player === socket.id) {
				$('#' + data.id).remove();
				$board = $('.player-board');
			} else {
				$board = $('.opponent-board');
			}
			if (!data.image) {
				data.image = 'dr6.png'
			}
			$board.append(template('card', data));

			if (data.type == 'player') {
				$('#' + data.id).on('click', function () {
					if (cardActionState == 'InAttack') {
						game.emit('attack', selected, data);
						selected = undefined;
						cardActionState = 'Normal';
					}
				});
			}
			else {
				$('#' + data.id).on('click', function () {
					if (cardActionState == 'Normal') {
						selected = data;
						cardActionState = 'InAttack';
					} else if (cardActionState == 'InBattleRattle') {
						game.emit('playCard', cardDoingBattleRattle, data);
						cardActionState = 'Normal';
					} else if (cardActionState == 'InAttack') {
						game.emit('attack', selected, data);
						selected = undefined;
						cardActionState = 'Normal';
					}
				});
			}
		});

		game.on('cardKilled', function (data) {
			console.log('card died');
			$('#' + data.id).remove();
		});

		game.on('joinedRoom', function (data) {
			console.log(data.roomName);
		});
	}
}
