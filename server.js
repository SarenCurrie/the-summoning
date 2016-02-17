var express = require('express');
var http = require('http');
var chat = require('./apps/chat');
var game = require('./apps/game');
var lobby = require('./apps/lobby');
var id = require('./apps/util/idHandler');

// Set up application.
var app = express();
var port = process.env.PORT || 3030;

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.use('/', express.static(__dirname + '/public/'));

var server = http.createServer(app).listen(port, function() {
	console.log('Listening on port ' + port);
});

var io = require('socket.io').listen(server);

var createServer = function() {

	io.on('connection', function(socket) {
		console.log('a user connected');

		socket.on('joinServer', function(data) {
			chat(socket, io);
			var theLobby = lobby(socket, io);

			theLobby.addPlayer(id(socket.id), data.name);

			socket.on('disconnect', function() {
				console.log('user disconnected');
				theLobby.removePlayer(id(socket.id));
			});
		});
	});

	return app;
};

module.exports = createServer;
