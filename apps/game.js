var _ = require('underscore');
var uuid = require('node-uuid');
var chat = require('./chat');
var id = require('./util/idHandler');
var cards = require('./gamedata/cards');
var decks = require('./gamedata/decks');

var createGame = function(io, room) {
	console.log('creating namespace ' + room.roomName);

	// Create socket.io namespace for room
	var game = io.of(room.roomName);

	var facesRecieved = false;
	var relicRequirement = [10, 15, 20, 30, 40];
	var sacrificeRequirement = [2, 3, 4, 5, 5];
	var turnNum = 0;
	var player1;
	var player2;
	var currentPlayer;
	var sacrificedMinions = [];
	room.graveyard = [];

	game.on('connection', function(socket) {
		var sId = id(socket.id);

		var gameChat = chat(socket, game);
		gameChat.playerMessage('Welcome to room: ' + room.roomName);
		gameChat.allMessage(sId + ' joined the game.')

		console.log(sId + ' joined ' + room.roomName);

		// Initialise player proprties
		room.players[sId].ready = false;
		room.players[sId].cards = {};
		room.players[sId].board = {};
		room.players[sId].relics = 0;
		room.players[sId].facedamage = 0;
		room.players[sId].faces = null;
		room.players[sId].deck = [];
		room.players[sId].mullcards = [];
		room.players[sId].sacModifier = 0;

		var cardSet = cards({
			summonCard: function(summoner, summonee) {
				console.log('summoning card');

				var pId = summoner.player;
				var cardId = uuid.v4();
				var card = {};

				if (_.size(room.players[pId].board) > 6) {
					// Board full
					return;
				}

				_.extend(card, summonee, { player: pId, id: cardId });

				room.players[pId].board[cardId] = card;

				game.emit('cardPlayed', card, room.players[pId].mana);
			},
			killCard: function(card) {
				console.log('Killing card: ' + card.name);
				room.players[card.player].board[card.id].causeOfDeath = 'damage';
				var deadCard = room.players[card.player].board[card.id];
				room.graveyard.push(deadCard);
				room.players[card.player].board[card.id].deathCry(room);

				// Let other cards know that a card died
				for (var cId in room.players[player1].board) {
					if (room.players[player1].board.hasOwnProperty(cId)) {
						card.onEvent(room, 'death', room.players[card.player].board[card.id]);
					}
				}
				for (var cId in room.players[player2].board) {
					if (room.players[player2].board.hasOwnProperty(card)) {
						card.onEvent(room, 'death', room.players[card.player].board[card.id]);
					}
				}
			},

			// @FIXME: Rename this method
			itsReallyOver: function(card) {
				delete room.players[card.player].board[card.id];
				game.emit('cardKilled', card);
			},
			discardCard: function(card) {
				delete room.players[card.player].cards[card.id];
				game.emit('cardDiscarded', card);
			},
			changeCard: function(card) {
				console.log('Changing card: ' + card.name);
				console.log(card);
				game.emit('cardChanged', card);
			},
			draw: function(card, list) {
				console.log('Card forcing draw!');
				drawCard(card, list);
				console.log('Done!');
			},
			earnDamage: function(card, amount, self) {
				var toAward = card.player;
				if (self) {
					if (card.player == player1) {
						toAward = player2;
					} else {
						toAward = player1;
					}
				}
				console.log('Awarding ' + amount + ' damage to ' + toAward + '.');
				hitFace(toAward, amount);
			}
		});

		//this is kind of a patchy fix for players also being minions. TODO!
		var decksToLoad = decks();
		var playersDeck;
		if (!player1) {
			var playersDeck = decksToLoad.sacrifice;
		} else {
			var playersDeck = decksToLoad.beast;
		}
		var shuffledDeck = _.shuffle(playersDeck.cards);
		for (var i = 0; i < 30; i++) {
			var nextCard = cardSet[shuffledDeck[i]];
			var cardId = uuid.v4();
			var card = {};
			_.extend(card, nextCard, { player: sId, id: cardId });
			room.players[sId].deck[i]  = card;
			if (i < 3) {
				room.players[sId].mullcards[i] = room.players[sId].deck[i].id;
			}
		}
		// console.log('printing deck!');
		// console.log(room.players[sId].deck);
		// console.log(_.size(room.players[sId].deck));

		if (!player1) {
			player1 = sId;
			var cardId = uuid.v4(); // Generate unique id
			var card = {};
			_.extend(card, cardSet.player1, { player: sId, id: cardId });
			room.players[sId].board[cardId] = card;
			room.players[sId].faces = card;
		} else {
			player2 = sId;
			var cardId = uuid.v4(); // Generate unique id
			var card = {};
			_.extend(card, cardSet.player2, { player: sId, id: cardId });
			room.players[sId].board[cardId] = card;
			room.players[sId].faces = card;
			console.log('starting game');
			game.emit('newTurn', {
				room: room,
				turnPlayer: player1,
				turnNum: turnNum
			});
		}

		socket.on('endTurn', function() {
			console.log('End of turn');
			var sId = id(socket.id);
			var nextPlayer = sId === player1 ? player2 : player1;
			for (var key in room.players[sId].board) {
				room.players[sId].board[key].endOfTurn(room);
			}

			for (var key in room.players[sId].board) {
				room.players[sId].board[key].onEvent(room, 'cleanup');
			}
			console.log('cleaning up');
			for (var i in room.graveyard) {
				room.graveyard[i].onEvent(room, 'cleanup');
			}

			console.log('graveyard was:');
			console.log(room.graveyard);
			room.graveyard = [];
			console.log('graveyard is:');
			console.log(room.graveyard);

			if (sId === player2) {
				turnNum++;
			}
			room.players[nextPlayer].mana = turnNum;

			console.log(nextPlayer + ' is starting turn ' + turnNum);
			console.log('SoT');
			for (var key in room.players[nextPlayer].board) {
				room.players[nextPlayer].board[key].startOfTurn(room);
			}

			refresh(nextPlayer);

			game.emit('newTurn', {
				turnPlayer: nextPlayer,
				turnNum: turnNum,
				mana: room.players[nextPlayer].mana
			});
		});

		// @TODO: This function should probably be moved somewhere else.
		function pickRandomProperty(obj) {
			var result;
			var count = 0;
			for (var prop in obj) {
				if (Math.random() < 1 / ++count) {
					result = prop;
				}
			}
			return obj[result];
		}

		function hitFace(playerToAward, howMuch) {
			room.players[playerToAward].facedamage += howMuch;
			while (room.players[playerToAward].facedamage > relicRequirement[room.players[playerToAward].relics]) {
				room.players[playerToAward].facedamage -= relicRequirement[room.players[playerToAward].relics];
				room.players[playerToAward].relics += 1;
				console.log('relic earned!');
				game.emit('relicEarned', playerToAward, room.players[playerToAward].relics);
				if (room.players[playerToAward].relics >= 5) {
					game.emit('gameOver', playerToAward);
				}
			}
			game.emit('faceDamageEarned', playerToAward, room.players[playerToAward].facedamage);
		}

		function drawCard(data, list) {
			var tempsID;
			if (data) {
				tempsID = data.player;
			} else {
				tempsID = sId;
			}
			console.log('player ' + tempsID + ' draws');
			if (_.size(room.players[tempsID].cards) < 10) {
				if (list) {
					for (i in list) {
						var cardId = uuid.v4();
						var card = {};
						_.extend(card, cardSet[list[i]], { player: tempsID, id: cardId });
						room.players[tempsID].cards[card.id] = card;
						socket.emit('cardDrawn', card);
					}
				} else {
					var card = room.players[tempsID].deck.shift();
					console.log('deck size is');
					console.log(_.size(room.players[tempsID].deck));
					room.players[tempsID].cards[card.id] = card;

					socket.emit('cardDrawn', card);
					game.emit('updateSize', tempsID, _.size(room.players[tempsID].deck));
				}
			} else {
				console.log('card "burnt"');
			}
		}

		socket.on('drawCard', function(data) {
			drawCard(data);
		});

		function refresh(nextPlayer) {
			console.log('refresh ' + nextPlayer);

			// console.log(room.players[nextPlayer]);
			for (var key in room.players[nextPlayer].board) {
				room.players[nextPlayer].board[key].attacks = 1;
			}
		}

		socket.on('mulliganCard', function(data) {
			if (_.contains(room.players[sId].mullcards, data.id)) {
				console.log(sId + ' mulliganed ' + data.name);
				console.log(room.players[sId].deck);
				var num;
				while (true) {
					num = Math.floor(Math.random() * (_.size(room.players[sId].deck)));
					console.log('random num: ' + num);
					if (room.players[sId].deck[num].type != 'player') {
						break;
					}
				}
				var temp = room.players[sId].cards[data.id];
				var card = room.players[sId].deck[num];
				room.players[sId].cards[card.id] = card;
				room.players[sId].deck[num] = temp;
				delete room.players[sId].cards[data.id];
				socket.emit('cardMulliganed', data);
				socket.emit('cardDrawn', card);
				game.emit('updateSize', sId, _.size(room.players[sId].deck));
			} else {
				console.log('Can\'t mulligan a card you just recieved');
			}
		});

		socket.on('playCard', function(data, target) {
			console.log('board size is');
			console.log(_.size(room.players[sId].board));

			if (_.size(room.players[sId].board) > 6) {
				return;
			}

			if (room.players[sId].mana < room.players[sId].cards[data.id].mana) {
				return;
			}

			room.players[sId].mana -= room.players[sId].cards[data.id].mana;
			var mana = room.players[sId].mana;
			room.players[sId].board[data.id] = room.players[sId].cards[data.id];
			delete room.players[sId].cards[data.id];

			game.emit('cardPlayed', data, mana);

			// Let other cards know that a card was played
			for (var card in room.players[player1].board) {
				if (room.players[player1].board.hasOwnProperty(card)) {
					card.onEvent(room, 'cardPlayed', room.players[sId].board[data.id]);
				}
			}
			for (var card in room.players[player2].board) {
				if (room.players[player2].board.hasOwnProperty(card)) {
					card.onEvent(room, 'cardPlayed', room.players[sId].board[data.id]);
				}
			}

			if (target) {
				activateBR(data, target);
			} else {
				room.players[sId].board[data.id].battleRattle(room);
			}

		});

		socket.on('getBoardSize',  function(data) {
			console.log('here we go');
			console.log(room.players[data.player].board);
			console.log(room.players[player2].board);
			if (data.player == player1) {
				socket.emit('boardSize', _.size(room.players[data.player].board), _.size(room.players[player2].board), data);
			} else {
				socket.emit('boardSize', _.size(room.players[data.player].board), _.size(room.players[player1].board), data);
			}

		});

		socket.on('getFaces',  function() {
			if (!facesRecieved) {
				facesRecieved = true;
				for (var key in room.players) {
					game.emit('cardPlayed', room.players[key].faces, 1);
				}
			}
		});

		socket.on('sacrifice',  function(data) {
			for (var i in sacrificedMinions) {
				if (data.id == sacrificedMinions[i].id) {
					// Minion has already been sacrificed
					console.log('Minion already sacrificed!');
					return;
				}
			}
			var player = data.player;
			console.log('Sacrificing minion!');
			console.log(data);
			sacrificedMinions.push(data);
			console.log('Deathrow is:');
			console.log(sacrificedMinions);
			if (_.size(sacrificedMinions) == (sacrificeRequirement[room.players[player].relics] + room.players[player].sacModifier)) {
				room.players[player].relics += 1;
				console.log('relic earned!');
				game.emit('relicEarned', player, room.players[player].relics);
				if (room.players[player].relics >= 5) {
					game.emit('gameOver', player);
				}
				console.log('player sacrificed');
				console.log(sacrificedMinions);
				for (var i in sacrificedMinions) {
					minion = sacrificedMinions[i];
					console.log('Killing card: ' + minion.name);
					console.log(minion);
					room.players[card.player].board[minion.id].causeOfDeath = 'sacrifice';
					var deadCard = room.players[card.player].board[minion.id];
					room.graveyard.push(deadCard);
					room.players[card.player].board[minion.id].deathCry(room);
				}
				for (var key in room.players[card.player].board) {
					room.players[card.player].board[key].onEvent(room, 'sacrifice');
				}
				sacrificedMinions = [];
				socket.emit('sacrificeComplete');
			}
		});

		function activateBR(card, target) {
			console.log('activating battlerattle');
			console.log(card);
			console.log(target);
			console.log('check card on board');
			console.log(room.players[card.player].board[card.id]);
			console.log('check target on board');
			console.log(room.players[target.player].board[target.id]);
			room.players[card.player].board[card.id].battleRattle(room, room.players[target.player].board[target.id]);
		}

		socket.on('attack', function(attacker, victim) {
			console.log('attacking');
			console.log(attacker);
			console.log('victim');
			console.log(victim);
			if (room.players[sId].board[attacker.id]) {
				if (room.players[sId].board[attacker.id].attacks == 0) {
					console.log('This minion can\'t attack!');
					return;
				}
				if (room.players[sId].board[victim.id]) {
					console.log('Can\'t attack your own minions!');
					return;
				}
				if (room.players[sId].board[attacker.id].type == 'player') {
					console.log(room.players[sId].board[attacker.id].type);
					console.log('Can\'t attack with your own face! How did you even gain attack?');
					return;
				}
				if (room.players[victim.player].board[victim.id].type == 'player') {
					if (_.size(room.players[victim.player].board) > 1) {
						console.log('You must clear the board before going face!');
						return;
					} else {
						hitFace(sId, room.players[sId].board[attacker.id].damage);
						room.players[sId].board[attacker.id].attacks -= 1;
						return;
					}
				}

				room.players[sId].board[attacker.id].attacks -= 1;
				room.players[sId].board[attacker.id].attack(room, room.players[victim.player].board[victim.id]);
			} else {
				console.log('This minion doesn\'t belong to you!');
			}
		});
	});

	console.log('started');

	// Tell player to join new namespace now that it has been created
	io.emit('roomStarted', {
		roomName: room.roomName,
		players: room.players
	});
};

module.exports = createGame;
