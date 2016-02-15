var iconMapper = require('../util/iconMapper');
var _ = require('underscore');

// Card = function(obj) {
// 	this.name = obj.name;
// 	this.mana = obj.mana;
// 	this.attack = obj.attack;
// 	this.health = obj.health;
//
// };
//
// Card.prototype.attack = function () {
// 	var self = this;
//
// 	target.health -= self.attack;
// 	self.health -= target.attack;
// 	if (target.health <= 0) {
// 		game.killCard(target);
// 	}
// 	if (self.health <= 0) {
// 		game.killCard(self);
// 	}
// };

module.exports = function (game) {
	function getCardsFromRoom(card, room) {
		var opponentId;
		var opponentCards;
		var playerCards;

		for (var playerId in room.players) {
			if (room.players.hasOwnProperty(playerId)) {
				if (playerId !== card.player) {
					opponentId = playerId;
					break;
				}
			}
		}

		playerCards = room.players[card.player].board;
		opponentCards = room.players[opponentId].board;

		return {
			player: playerCards,
			opponent: opponentCards
		};
	}

	function damage(room, target, damage) {

		target.health -= damage;
		if (target.health <= 0) {
			game.killCard(target);
			return;
		}
			game.changeCard(target);

	}

	function simpleAttack (room, self, target) {

		damage(room, target, self.damage);
		damage(room, self, target.damage);

		// target.health -= self.damage;
		// self.health -= target.damage;
		// if (target.health <= 0) {
		// 	game.killCard(target);
		// }
		// if (self.health <= 0) {
		// 	game.killCard(self);
		// }
	}

	var cards = {
		// dean: {
		// 	name: 'Dean',
		// 	mana: 1,
		// 	damage: 1,
		// 	health: 1,
		// 	attacks: 0,
		// 	type: 'minion',
		// 	description: 'Battlerattle: If dean is playing the game, he must give everyone chocolate.',
		//
		// 	battleRattleTarget: true,
		// 	battleRattle: function (room, target) {
		// 		var self = this;
		// 		console.log(room, target);
		// 		//
		// 	},
		// 	deathCry: function (room) {
		// 		var self = this;
		//
		// 		//
		// 	},
		// 	startOfTurn: function (room) {
		// 		var self = this;
		//
		// 		//
		// 	},
		// 	endOfTurn: function (room) {
		// 		var self = this;
		//
		// 		//
		// 	},
		// 	attack: function (room, target) {
		// 		var self = this;
		//
		// 		game.summonCard(self, self);
		// 		simpleAttack(room, self, target);
		// 	}
		// },
		player1: {
			name: 'Player1',
			mana: 1,
			damage: 1,
			health: 1,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'player',
			description: 'THIS IS PLAYER ONE FACE.',
			battleRattle: function (room, target) {
				var self = this;

				//
			},
			deathCry: function (room) {
				var self = this;
				game.itsReallyOver(self);
				//
			},
			startOfTurn: function (board) {
				var self = this;

				//
			},
			endOfTurn: function (board) {
				var self = this;

				//
			},
			attack: function (room, target) {
				var self = this;

				//
			}
		},
		player2: {
			name: 'Player2',
			mana: 1,
			damage: 1,
			health: 1,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'player',
			description: 'THIS IS PLAYER TWO FACE.',
			battleRattle: function (room, target) {
				var self = this;

				//
			},
			deathCry: function (room) {
				var self = this;
				game.itsReallyOver(self);
				//
			},
			startOfTurn: function (board) {
				var self = this;

				//
			},
			endOfTurn: function (board) {
				var self = this;

				//
			},
			attack: function (room, target) {
				var self = this;

				//
			}
		},
		wingriderDemon: {
			name: 'Wingrider Demon',
			image: 'DEMON.png',
			mana: 1,
			damage: 2,
			health: 3,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Deathcry: Draw a card.',
			battleRattle: function (room, target) {
				var self = this;

				//
			},
			deathCry: function (room) {
				var self = this;

				game.draw(self);

				game.itsReallyOver(self);
				//
			},
			startOfTurn: function (room) {
				var self = this;

				//
			},
			endOfTurn: function (room) {
				var self = this;

				//
			},
			attack: function (room, target) {
				var self = this;

				simpleAttack(room, self, target);
			}
		},
		kumaraCopter: {
			name: 'Kumara Copter',
			image: 'knightgirl.png',
			mana: 1,
			damage: 2,
			health: 8,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Target minion gains +6/+0.',
			battleRattleTarget: true,
			battleRattle: function (room, target) {
					target.damage += 6;
					game.changeCard(target);
			 		//
				},
			deathCry: function (room) {
				var self = this;
				game.itsReallyOver(self);

				//
			},
			startOfTurn: function (room) {
				var self = this;

				//
			},
			endOfTurn: function (room) {
				var self = this;

				//
			},
			attack: function (room, target) {
				var self = this;

				simpleAttack(room, self, target);
			}

		},
		summoningStone: {
			name: 'Summoning Stone',
			image: 'dr6.png',
			mana: 1,
			damage: 6,
			health: 6,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'EoT: Summon a Sleeping Statue.',
			battleRattle: function (room, target) {
				var self = this;

				//
				},
			deathCry: function (room) {
				var self = this;
      	game.itsReallyOver(self);
				//
			},
			startOfTurn: function (room) {
				var self = this;

				//
			},
			endOfTurn: function (room) {
				var self = this;
				game.summonCard(self, cards.sleepingStatue);
				//
			},
			attack: function (room, target) {
				var self = this;

				simpleAttack(room, self, target);
			}

		},
		sleepingStatue: {
			name: 'Sleeping Statue',
			image: 'zand.png',
			mana: 0,
			damage: 0,
			health: 1,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: '-.-',
			battleRattle: function (room, target) {
				var self = this;

				//
				},
			deathCry: function (room) {
				var self = this;
        game.itsReallyOver(self);
				//
			},
			startOfTurn: function (room) {
				var self = this;

				//
			},
			endOfTurn: function (room) {
				var self = this;

				//
			},
			attack: function (room, target) {
				var self = this;

				simpleAttack(room, self, target);
			}

		},
		cunningCobra: {
			name: 'Cunning Cobra',
			image: 'cobra.png',
			mana: 2,
			damage: 4,
			health: 4,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			battleRattleTarget: true,
			description: 'Battlerattle: Deal 4 damage to a minion. If it kills the minion, draw a card.',
			battleRattle: function (room, target) {
				var self = this;
				if (target.health <= 4){
					game.draw(self);
				}
				damage(room, target, 4);

				//
				},
			deathCry: function (room) {
				var self = this;
        game.itsReallyOver(self);
				//
			},
			startOfTurn: function (room) {
				var self = this;

				//
			},
			endOfTurn: function (room) {
				var self = this;

				//
			},
			attack: function (room, target) {
				var self = this;

				simpleAttack(room, self, target);
			}

		},
		desertMarauder: {
			name: 'Desert Marauder',
			image: 'maraudererer.png',
			mana: 2,
			damage: 5,
			health: 3,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			battleRattleTarget: true,
			description: 'Battlerattle: Deal damage to a minion equal to x2 the number of minions on your board.',
			battleRattle: function (room, target) {
				var self = this;

				damage(room, target, (_.size(room.players[self.player].board)-1)*2);
				},
			deathCry: function (room) {
				var self = this;
				game.itsReallyOver(self);
				//
			},
			startOfTurn: function (room) {
				var self = this;

				//
			},
			endOfTurn: function (room) {
				var self = this;

				//
			},
			attack: function (room, target) {
				var self = this;

				simpleAttack(room, self, target);
			}

		},
		locustSwarm: {
			name: 'Locust Swarm',
			image: 'swarm.png',
			mana: 2,
			damage: 6,
			health: 4,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'When this minion is sacrificed return it to your hand.',
			battleRattle: function (room, target) {
				var self = this;

				//
				},
			deathCry: function (room) {
				var self = this;
				if (self.causeOfDeath == 'sacrifice'){
				game.draw(self, ['locustSwarm']);
				}
				game.itsReallyOver(self);
				//
			},
			startOfTurn: function (room) {
				var self = this;

				//
			},
			endOfTurn: function (room) {
				var self = this;

				//
			},
			attack: function (room, target) {
				var self = this;

				simpleAttack(room, self, target);
			}

		},
		wingridersDemon: {
			name: 'Wingridersssssss Demon',
			image: 'DEMON.png',
			mana: 1,
			damage: 0,
			health: 100,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'VALUE',
			battleRattle: function (room, target) {
				var self = this;

				//
			},
			deathCry: function (room) {
				var self = this;
				game.itsReallyOver(self);

				//
			},
			startOfTurn: function (room) {
				var self = this;

				//
			},
			endOfTurn: function (room) {
				var self = this;

				//
			},
			attack: function (room, target) {
				var self = this;

				simpleAttack(room, self, target);
			}
		}
	};

	return cards;
};
