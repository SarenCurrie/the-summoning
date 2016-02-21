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

	function damage(room, target, damageValue) {

		target.health -= damageValue;
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
		youngHunter: {
			name: 'Young Hunter',
			ident: 'youngHunter',
			race: 'Beast',
			class: ['Wolf'],
			image: 'trapped.png',
			mana: 1,
			damage: 2,
			health: 3,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'BattleRattle: Draw a card.',
			battleRattle: function(room, target) {
				var self = this;

				game.draw(self);
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
			}
		},
		ambush: {
			name: 'Ambush',
			ident: 'ambush',
			race: 'Beast',
			class: ['Wolf'],
			image: 'trapped.png',
			mana: 1,
			damage: 5,
			health: 5,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Can\'t attack',
			battleRattle: function(room, target) {
				var self = this;
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
			},
			onEvent: function(room, effect, card) {
				var self = this;
			}
		},
		nightStalker: {
			name: 'Night Stalker',
			ident: 'nightStalker',
			race: 'Beast',
			class: ['Wolf'],
			image: 'DEMON.png',
			mana: 2,
			damage: 3,
			health: 6,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Gain +2 attack for each other beast in play',
			battleRattle: function(room, target) {
				var self = this;

				var cards = getCardsFromRoom(self, room);

				for (var card in cards.player) {
					if (cards.player.hasOwnProperty(card)) {
						if (cards.player[card].race === 'Beast') {
							self.attack += 2;
						}
					}
				}

				for (var card in cards.opponent) {
					if (cards.opponent.hasOwnProperty(card)) {
						if (cards.opponent[card].race === 'Beast') {
							self.attack += 2;
						}
					}
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
			}
		},
		wildsDruid: {
			name: 'Wilds Druid',
			ident: 'wildsDruid',
			race: 'Elf',
			class: ['Druid'],
			image: 'acolyte.png',
			mana: 2,
			damage: 2,
			health: 5,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Give a beast +5/+5',
			battleRattleTarget: true,
			battleRattle: function(room, target) {
				if (target) {
					target.damage += 5;
					target.health += 5;
					game.changeCard(target);
				}
			},
			deathCry: function(room) {
				var self = this;
				game.itsReallyOver(self);

				//
			},
			startOfTurn: function(room) {
				var self = this;

				//
			},
			endOfTurn: function(room) {
				var self = this;

				//
			},
			attack: function(room, target) {
				var self = this;

				simpleAttack(room, self, target);
			},
			onEvent: function(room, effect, card) {
				var self = this;
			}
		},
		plainsEagle: {
			name: 'Plains Eagle',
			ident: 'plainsEagle',
			race: 'Beast',
			class: ['Bird'],
			image: 'reddemer.png',
			mana: 2,
			damage: 3,
			health: 4,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'This card does not take damage while attacking.',
			battleRattle: function(room, target) {
				var self = this;
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

				damage(room, target, self.damage);
			},
			onEvent: function(room, effect, card) {
				var self = this;
			}
		},
		huntsmaster: {
			name: 'Huntmaster',
			ident: 'huntsmaster',
			race: 'Human',
			class: ['Hunter'],
			image: 'dr6.png',
			mana: 3,
			damage: 3,
			health: 7,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Summon 2 3/2 Hunting Hounds.',
			battleRattle: function(room, target) {
				var self = this;

				game.summonCard(self, cards.huntingHound);
				game.summonCard(self, cards.huntingHound);
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
			}

		},
		huntingHound: {
			name: 'Hunting Hound',
			ident: 'huntingHound',
			race: 'Beast',
			class: ['Hound'],
			image: 'zand.png',
			mana: 0,
			damage: 0,
			health: 3,
			attacks: 1,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: '🐶',
			battleRattle: function(room, target) {
				var self = this;
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
			}
		},
		wolfBorther: {
			name: 'Wolf Borther',
			ident: 'wolfBorther',
			race: 'Human',
			class: ['Druid'],
			image: 'astral.png',
			mana: 3,
			damage: 5,
			health: 7,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'When you summon a wolf, gain +2/+1',
			battleRattle: function(room, target) {
				var self = this;
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

				if (effect === 'cardPlayed') {
					if (card.player === self.player && _.contains(card.class, 'Wolf')) {
						self.attack += 2;
						self.health += 1;
					}
				}
			}
		},
		tundraStalker: {
			name: 'Tundra Stalker',
			ident: 'tundraStalker',
			race: 'Beast',
			class: ['Wolf'],
			image: 'astral.png',
			mana: 3,
			damage: 6,
			health: 8,
			maxHealth: 8, // A bit hacky, we need a better way to distinguish max, current and buffed health
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'EoT: Restore 1 Health',
			battleRattle: function(room, target) {
				var self = this;
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

				if (self.health < self.maxHealth) {
					self.health++;
				}
			},
			attack: function(room, target) {
				var self = this;

				simpleAttack(room, self, target);
			},
			onEvent: function(room, effect, card) {
				var self = this;

				if (effect === 'cardPlayed') {
					if (card.player === self.player && _.contains(card.class, 'Wolf')) {
						self.attack += 2;
						self.health += 1;
					}
				}
			}
		},
		carrionCrow: {
			name: 'Carrion Crow',
			ident: 'carrionCrow',
			race: 'Beast',
			class: ['Bird'],
			image: 'astral.png',
			mana: 3,
			damage: 2,
			health: 7,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'When a minon dies, draw a card',
			battleRattle: function(room, target) {
				var self = this;
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

				if (effect === 'death') {
					game.drawCard();
				}
			}
		},
		loneHunter: {
			name: 'Lone Hunter',
			ident: 'loneHunter',
			race: 'Beast',
			class: ['Wolf'],
			image: 'astral.png',
			mana: 4,
			damage: 6,
			health: 10,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: If you have no ther cards, deal 6 damage, if you do, deal 3.',
			battleRattle: function(room, target) {
				var self = this;

				var cards = getCardsFromRoom(self, room).player;

				if (_.count(cards) === 1) {
					// Just this card
					damage(room, target, 6);
				} else {
					damage(room, target, 3);
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
			}
		},
		savageBear: {
			name: 'Savage Bear',
			ident: 'savageBear',
			race: 'Beast',
			class: ['Bear'],
			image: 'zand.png',
			mana: 4,
			damage: 5,
			health: 10,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'When this minion attacks, summon a 2/2 Cub',
			battleRattle: function(room, target) {
				var self = this;
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
				game.summonCard(self, cards.cub);

				simpleAttack(room, self, target);
			},
			onEvent: function(room, effect, card) {
				var self = this;
			}
		},
		cub: {
			name: 'Cub',
			ident: 'cub',
			race: 'Beast',
			class: ['Bear'],
			image: 'zand.png',
			mana: 0,
			damage: 2,
			health: 2,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: '',
			battleRattle: function(room, target) {
				var self = this;
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
			}
		},
		hawkScout: {
			name: 'Hawk Scout',
			ident: 'hawkScout',
			race: 'Beast',
			class: ['Bird'],
			image: 'zand.png',
			mana: 4,
			damage: 7,
			health: 8,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Draw a card for each friendly beast',
			battleRattle: function(room, target) {
				var self = this;

				var cards = getCardsFromRoom(self, room).player;

				for (var card in cards) {
					if (cards.hasOwnProperty(card)) {
						if (cards[card].race === 'Beast') {
							game.drawCard();
						}
					}
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
			}
		},
		packOutcast: {
			name: 'Pack Outcast',
			ident: 'packOutcast',
			race: 'Beast',
			class: ['Wolf'],
			image: 'zand.png',
			mana: 5,
			damage: 10,
			health: 11,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Deal one damage to each emeny card, increase this damage by one for each friendly wolf.',
			battleRattle: function(room, target) {
				var self = this;
				var dmg = 1;
				var cards = getCardsFromRoom(self, room);

				for (var card in cards.player) {
					if (cards.player.hasOwnProperty(card)) {
						if (_.contains(cards.player[card].class, 'Wolf')) {
							dmg++;
						}
					}
				}

				for (var card in cards.opponent) {
					if (cards.opponent.hasOwnProperty(card)) {
						damage(room, cards.opponent[card], dmg);
					}
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
			}
		},
		alphaWolf: {
			name: 'Alpha Wolf',
			ident: 'alphaWolf',
			race: 'Beast',
			class: ['Wolf'],
			image: 'zand.png',
			mana: 5,
			damage: 10,
			health: 10,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'DeathCry: Give all other friendly beasts +3/+3',
			battleRattle: function(room, target) {
				var self = this;
			},
			deathCry: function(room) {
				var self = this;

				var cards = getCardsFromRoom(self, room).player;

				for (var card in cards) {
					if (cards.hasOwnProperty(card)) {
						if (cards[card].race === 'Beast') {
							cards[card].attack += 3;
							cards[card].health += 3;
							game.changeCard(cards[card]);
						}
					}
				}

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
		nightScrouge: {
			name: 'Night Scourge',
			ident: 'nightScrouge',
			race: 'Beast',
			class: ['Wolf'],
			image: 'zand.png',
			mana: 6,
			damage: 5,
			health: 15,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'When a friendly beast is killed, gain +4/+4',
			battleRattle: function(room, target) {
				var self = this;
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
				if (effect === 'death') {
					if (card.player === self.player && card.race === 'Beast') {
						self.attack += 4;
						self.health += 4;
						game.changeCard(self);
					}
				}
			}
		}
	};

	return cards;
};
