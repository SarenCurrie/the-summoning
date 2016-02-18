var _ = require('underscore');

module.exports = function(game) {
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

	function simpleAttack(room, self, target) {
		damage(room, target, self.damage);
		damage(room, self, target.damage);
	}

	var cards = {
		// Standard card with race and class.
		elfRanger: {
			name: 'Elf Ranger',
			ident: 'elfRanger',
			race: 'Elf',
			class: 'Ranger',
			image: 'DEMON.png',
			mana: 1,
			damage: 2,
			health: 3,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Deathcry: Draw a card.',
			battleRattle: function(room, target) {
				var self = this;
			},
			deathCry: function(room) {
				var self = this;

				game.draw(self);
				game.itsReallyOver(self);
			},
			startOfTurn: function(room) {
				var self = this;
			},
			endOfTurn: function(room) {
				var self = this;
			},
			attack: function(room, target) {
				var self = this;

				simpleAttack(room, self, target);
			},
			onEvent: function(room, effect, card) {
				var self = this;
			}
		},
		// Standard card with different race and class
		humanWarrior: {
			name: 'Human Warrior',
			ident: 'humanWarrior',
			race: 'Human',
			class: 'Warrior',
			image: 'knightgirl.png',
			mana: 1,
			damage: 2,
			health: 8,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Target minion gains +8/+0 this turn.',
			battleRattleTarget: true,
			battleRattle: function(room, target) {
				if (target) {
					target.damage += 8;
					this.debuff = target;
					game.changeCard(target);
				}
			},
			deathCry: function(room) {
				var self = this;

				game.itsReallyOver(self);
			},
			startOfTurn: function(room) {
				var self = this;
			},
			endOfTurn: function(room) {
				var self = this;
			},
			attack: function(room, target) {
				var self = this;

				simpleAttack(room, self, target);
			},
			onEvent: function(room, effect, card) {
				var self = this;
				if (effect == 'cleanup') {
					if (self.debuff) {
						var debuffed = self.debuff;
						if (debuffed) {
							debuffed.damage -= 8;
							game.changeCard(debuffed);
						}
						self.debuff = undefined;
					}
				}
			}
		},
		// Standard card with effect related to race
		humanPriest: {
			name: 'Human Priest',
			ident: 'humanPriest',
			race: 'Human',
			class: 'Priest',
			image: 'dr6.png',
			mana: 1,
			damage: 6,
			health: 6,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Give all friendly Humans +1 health at the start of each turn.',
			battleRattle: function(room, target) {
				var self = this;
			},
			deathCry: function(room) {
				var self = this;
				game.itsReallyOver(self);
			},
			startOfTurn: function(room) {
				// Race effect
				var self = this;
				var playerCards = getCardsFromRoom(self, room).player;

				for (var cId in playerCards) {
					if (playerCards.hasOwnProperty(cId)) {
						if (playerCards[cId].race === 'Human') {
							playerCards[cId].health += 1;
						}
					}
				}
			},
			endOfTurn: function(room) {
				var self = this;
			},
			attack: function(room, target) {
				var self = this;

				simpleAttack(room, self, target);
			},
			onEvent: function(room, effect, card) {
				var self = this;
			}
		}
	};

	return cards;
};
