var createChatServer = function(socket, io) {
	socket.on('chatMessage', function(data) {
		socket.broadcast.emit('chatMessage', data);
	});
};

module.exports = createChatServer;
