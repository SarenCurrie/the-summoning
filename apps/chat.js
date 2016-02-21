var createChatServer = function(socket, io) {
	socket.on('chatMessage', function(data) {
		console.log(data);
		io.emit('chatMessage', {
			source: 'player',
			name: data.name,
			message: data.message
		});
	});

	return {
		chat: function (from, message) {
			io.emit('chatMessage', {
				source: 'game',
				name: from,
				message: message
			});
		},
		playerMessage: function (message) {
			console.log('sending game message');
			socket.emit('chatMessage', {
				source: 'server',
				name: 'Game',
				message: message
			});
		},
		allMessage: function (message) {
			console.log('sending game message');
			io.emit('chatMessage', {
				source: 'server',
				name: 'Game',
				message: message
			});
		},
		error: function (message) {
			io.emit('chatMessage', {
				source: 'error',
				name: 'Error',
				message: message
			});
		}
	}
};

module.exports = createChatServer;
