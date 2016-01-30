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

	function damage(target, damage) {

		target.health -= damage;
		if (target.health <= 0) {
			game.killCard(target);
		}

	}

	function simpleAttack (room, self, target) {

		damage(target, self.damage);
		damage(self, target.damage);

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
		dean: {
			name: 'Dean',
			mana: 1,
			damage: 1,
			health: 1,
			description: 'Battlerattle: If dean is playing the game, he must give everyone chocolate.',
			battleRattle: function (room, target) {
				var self = this;

				//
			},
			deathCry: function (room) {
				var self = this;

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
		windriderEel: {
			name: 'Windrider Eel',
			mana: 1,
			damage: 2,
			health: 3,
			description: 'Deathcry: Draw a card.',
			battleRattle: function (room, target) {
				var self = this;

				//
			},
			deathCry: function (room) {
				var self = this;

				game.draw(self.player);

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
		savageHunger: {
			name: 'Savage Hunger',
			mana: 2,
			damage: 4,
			health: 4,
			description: 'Battlerattle: Draw a card.\nBattlerattle: ' + this.name + ' deals 4 damage to a card.',
			battleRattle: function (room, target) {
				var self = this;

				game.draw(self.player);
				damage(target, 4);

				//
			},
			deathCry: function (room) {
				var self = this;

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
		tomeScour: {
			name: 'Tome Scour',
			mana: 2,
			damage: 5,
			health: 5,
			description: 'Deathcry: Draw a card.',
			battleRattle: function (room, target) {
				var self = this;

				//
			},
			deathCry: function (room) {
				var self = this;

				game.draw(self.player);

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
		umaraRaptor: {
			name: 'Umara Raptor',
			mana: 2,
			damage: 5,
			health: 3,
			description: 'Battlerattle: ' + this.name + ' deals damage to a card equal to twice the number of cards you have on your board.',
			battleRattle: function (room, target) {
				var self = this;

				damage(target, 2 * _.size(getCardsFromRoom(self, room).player));

				//
			},
			deathCry: function (room) {
				var self = this;

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
		// lightningElemental: {
		// 	name: 'Lightning Elemental',
		// 	mana: 2,
		// 	damage: 5,
		// 	health: 3,
		// 	description: 'Battlerattle: Target card get +8/+0 until the end of this turn.',
		// 	battleRattle: function (room, target) {
		// 		var self = this;
		//
		// 		target.damage += 8;
		//
		// 		//set the end of turn remove buff
		// 		self.endOfTurn = function (room) {
		// 			target.damage -= 8;
		// 			//reset the endofTurn function
		// 			self.endOfTurn = function (room) {
		// 				var self = this;
		//
		// 				//
		// 			}
		// 		}
		//
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
		// 		simpleAttack(room, self, target);
		// 	}
		//
		// }
		zephyrSprite: {
			name: 'Zephyr Sprite',
			mana: 4,
			damage: 0,
			health: 12,
			description: 'At the start of your turn, destroy all cards.',
			battleRattle: function (room, target) {
				var self = this;

				//
			},
			deathCry: function (room) {
				var self = this;

				//
			},
			startOfTurn: function (room) {
				var self = this;

				var cards = getCardsFromRoom(self, room);
				for (var opponentCard in cards.opponent) {
					game.killCard(cards.opponent[opponentCard]);
				}
				for (var playerCard in cards.player) {
					game.killCard(cards.player[playerCard]);
				}

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
		seismicStrike: {
			name: 'Seismic Strike',
			mana: 5,
			damage: 8,
			health: 8,
			description: 'Battlerattle: Destroy target card.',
			battleRattle: function (room, target) {
				var self = this;

				game.killCard(target);

				//
			},
			deathCry: function (room) {
				var self = this;

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
		tidehollowStrix: {
			name: 'Tidehollow Strix',
			mana: 5,
			damage: 10,
			health: 12,
			description: 'Deathcry: Draw a card for each cards on your board. (Reminder: including this card.)',
			battleRattle: function (room, target) {
				var self = this;

				//
			},
			deathCry: function (room) {
				var self = this;

				for (var playerCard in getCardsFromRoom.player) {
					game.draw(self.player);
				}
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
