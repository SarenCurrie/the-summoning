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
			ident: 'player1',
			mana: 1,
			damage: 1,
			health: 1,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'player',
			description: 'THIS IS PLAYER ONE FACE.',
			battleRattle: function(room, target) {
				var self = this;

				//
			},
			deathCry: function(room) {
				var self = this;
				game.itsReallyOver(self);

				//
			},
			startOfTurn: function(board) {
				var self = this;

				//
			},
			endOfTurn: function(board) {
				var self = this;

				//
			},
			attack: function(room, target) {
				var self = this;

				//
			},
			onEvent: function(room, effect, card) {
				var self = this;

				//
			}
		},
		player2: {
			name: 'Player2',
			ident: 'player2',
			mana: 1,
			damage: 1,
			health: 1,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'player',
			description: 'THIS IS PLAYER TWO FACE.',
			battleRattle: function(room, target) {
				var self = this;

				//
			},
			deathCry: function(room) {
				var self = this;
				game.itsReallyOver(self);

				//
			},
			startOfTurn: function(board) {
				var self = this;

				//
			},
			endOfTurn: function(board) {
				var self = this;

				//
			},
			attack: function(room, target) {
				var self = this;

				//
			},
			onEvent: function(room, effect, card) {
				var self = this;

				//
			}
		},
		trappedAdventurer: {
			name: 'Trapped Adventurer',
			ident: 'trappedAdventurer',
			image: 'trapped.png',
			mana: 1,
			damage: 2,
			health: 3,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Deathcry: Draw a card.',
			battleRattle: function(room, target) {
				var self = this;

				//
			},
			deathCry: function(room) {
				var self = this;

				game.draw(self);

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

				//
			}
		},
		jackalwere: {
			name: 'Jackalwere',
			ident: 'jackalwere',
			image: 'DEMON.png',
			mana: 2,
			damage: 5,
			health: 5,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Deathcry: Draw a card.',
			battleRattle: function(room, target) {
				var self = this;

				//
			},
			deathCry: function(room) {
				var self = this;

				game.draw(self);

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

				//
			}
		},
		acolyteOfTheSun: {
			name: 'Acolyte of the Sun',
			ident: 'acolyteOfTheSun',
			image: 'acolyte.png',
			mana: 3,
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

				//
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

				//
			}

		},
		summoningStone: {
			name: 'Summoning Stone',
			ident: 'summoningStone',
			image: 'dr6.png',
			mana: 3,
			damage: 6,
			health: 6,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'EoT: Summon a Sleeping Statue.',
			battleRattle: function(room, target) {
				var self = this;

				//
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
				game.summonCard(self, cards.sleepingStatue);

				//
			},
			attack: function(room, target) {
				var self = this;

				simpleAttack(room, self, target);
			},
			onEvent: function(room, effect, card) {
				var self = this;

				//
			}

		},
		sleepingStatue: {
			name: 'Sleeping Statue',
			ident: 'sleepingStatue',
			image: 'zand.png',
			mana: 0,
			damage: 0,
			health: 1,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: '-.-',
			battleRattle: function(room, target) {
				var self = this;

				//
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

				//
			}

		},
		valhallaRedeemer: {
			name: 'Valhalla Redeemer',
			ident: 'valhallaRedeemer',
			image: 'reddemer.png',
			mana: 7,
			damage: 14,
			health: 16,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'EoT: Resummon all minions sacrificed this turn.',
			battleRattle: function(room, target) {
				var self = this;

				//
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
				for (var i in room.graveyard) {
					if (room.graveyard[i].player == self.player){
						if (room.graveyard[i].causeOfDeath == 'sacrifice'){
							game.summonCard(self, cards[room.graveyard[i].ident]);
						}
					}
				}
				//
			},
			attack: function(room, target) {
				var self = this;

				simpleAttack(room, self, target);
			},
			onEvent: function(room, effect, card) {
				var self = this;

				//
			}

		},
		astralOfTheSun: {
			name: 'Astral of the Sun',
			ident: 'astralOfTheSun',
			image: 'astral.png',
			mana: 8,
			damage: 18,
			health: 16,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Sacrifice requires one less minion.',
			battleRattle: function(room, target) {
				var self = this;
				room.players[self.player].sacModifier += -1;
				//
			},
			deathCry: function(room) {
				var self = this;
				room.players[self.player].sacModifier += 1;
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

				//
			}

		},
		sandShaper: {
			name: 'Sand Shaper',
			ident: 'sandShaper',
			image: 'zand.png',
			mana: 6,
			damage: 10,
			health: 10,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Deathcry: Summon 6 Sleeping Statue\'s',
			battleRattle: function(room, target) {
				var self = this;

				//
			},
			deathCry: function(room) {
				var self = this;
				for (i = 0; i < 6; i++) {
					game.summonCard(self,cards.sleepingStatue);
				}
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

				//
			}

		},
		ferociousCamel: {
			name: 'Ferocious Camel',
			ident: 'ferociousCamel',
			image: 'zand.png',
			mana: 6,
			damage: 7,
			health: 7,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Summon ANOTHER Ferocious Camel.',
			battleRattle: function(room, target) {
				var self = this;
				game.summonCard(self, cards.ferociousCamel);
				//
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

				//
			}

		},
		basilisk: {
			name: 'Basilisk',
			ident: 'basilisk',
			image: 'zand.png',
			mana: 5,
			damage: 8,
			health: 8,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			battleRattleTarget: true,
			description: 'Battlerattle: Destroy target minion.',
			battleRattle: function(room, target) {
				var self = this;
				game.killCard(target);
				//
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

				//
			}

		},
		priestessOfTheSun: {
			name: 'Priestess of the Sun',
			ident: 'priestessOfTheSun',
			image: 'zand.png',
			mana: 5,
			damage: 10,
			health: 12,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Draw a card for each minion you have on board.',
			battleRattle: function(room, target) {
				var self = this;
				for (var key in room.players[self.player].board) {
					game.draw(self);
				}
				//
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

				//
			}

		},
		oasisDjinni: {
			name: 'Oasis Djinni',
			ident: 'oasisDjinni',
			image: 'oasis.png',
			mana: 5,
			damage: 9,
			health: 13,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Whenever you sacrifice minions, draw a card for each ritual piece you have afterwards.',
			battleRattle: function(room, target) {
				var self = this;

				//
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
				if (effect == 'sacrifice') {
					for (i = 0; i < room.players[self.player].relics; i++) {
    				game.draw(self);
					}
				}
				//
			}

		},
		dustGolem: {
			name: 'Dust Golem',
			ident: 'dustGolem',
			image: 'zand.png',
			mana: 5,
			damage: 12,
			health: 6,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Deathcry: Summon 2 Sleeping Statue\'s',
			battleRattle: function(room, target) {
				var self = this;

				//
			},
			deathCry: function(room) {
				var self = this;
				game.summonCard(self, cards.sleepingStatue);
				game.summonCard(self, cards.sleepingStatue);
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

				//
			}

		},
		mummyLord: {
			name: 'Mummy Lord',
			ident: 'mummyLord',
			image: 'zand.png',
			mana: 4,
			damage: 6,
			health: 8,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Whenever one of your minions die in combat, summon a 2/2 Lil\' Mummy.',
			battleRattle: function(room, target) {
				var self = this;

				//
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
				if (effect == 'death') {
					
					game.summonCard(self, cards.lilMummy);
				}

				//
			}

		},
		lilMummy: {
			name: 'Lil\' Mummy',
			ident: 'lilMummy',
			image: 'zand.png',
			mana: 0,
			damage: 2,
			health: 2,
			attacks: 0,
			token: true,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Not as cute as the name suggests.',
			battleRattle: function(room, target) {
				var self = this;

				//
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

				//
			}

		},
		skeletalSandworm: {
			name: 'Skeletal Sandworm',
			ident: 'skeletalSandworm',
			image: 'zand.png',
			mana: 4,
			damage: 8,
			health: 10,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Deathcry: Draw a card. If sacrificed, draw 2.',
			battleRattle: function(room, target) {
				var self = this;

				//
			},
			deathCry: function(room) {
				var self = this;
				game.draw(self);
				if (self.causeOfDeath == 'sacrifice') {
					game.draw(self);
				}
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

				//
			}

		},
		theHarbinger: {
			name: 'The Harbinger',
			ident: 'theHarbinger',
			image: 'zand.png',
			mana: 4,
			damage: 0,
			health: 12,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'SoT: Destroy ALL minions.',
			battleRattle: function(room, target) {
				var self = this;

				//
			},
			deathCry: function(room) {
				var self = this;
				game.itsReallyOver(self);

				//
			},
			startOfTurn: function(room) {
				var self = this;
				for (var key in room.players) {
					for (var key2 in room.players[key].board) {
						var card = room.players[key].board[key2];
						if (self.id != card.id) {
							if (card.type != 'player') {
								game.killCard(card);
							}
						}
					}
				}
				game.killCard(self); // Sudoku. ;_;
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

				//
			}

		},
		masonsApprentice: {
			name: 'Mason\'s Apprentice',
			ident: 'masonsApprentice',
			image: 'zand.png',
			mana: 2,
			damage: 4,
			health: 6,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Deathcry: Summon a Sleeping Statue.',
			battleRattle: function(room, target) {
				var self = this;

				//
			},
			deathCry: function(room) {
				var self = this;
				game.summonCard(self, cards.sleepingStatue);
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

				//
			}

		},
		masterMason: {
			name: 'Master Mason',
			ident: 'masterMason',
			image: 'zand.png',
			mana: 3,
			damage: 5,
			health: 9,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Summon a Sleeping Statue.',
			battleRattle: function(room, target) {
				var self = this;
				game.summonCard(self, cards.sleepingStatue);

				//
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

				//
			}

		},
		manicMerchant: {
			name: 'Manic Merchant',
			ident: 'manicMerchant',
			image: 'zand.png',
			mana: 3,
			damage: 8,
			health: 7,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Draw a card. Deathcry: Deal 5 damage to yourself.',
			battleRattle: function(room, target) {
				var self = this;
				game.draw(self);

				//
			},
			deathCry: function(room) {
				var self = this;
				game.earnDamage(self, 5, true);
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

				//
			}

		},
		dustWight: {
			name: 'Dust Wight',
			ident: 'dustWight',
			image: 'zand.png',
			mana: 3,
			damage: 8,
			health: 6,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'If this minion is sacrificed, summon a Dust Wight at EoT.',
			battleRattle: function(room, target) {
				var self = this;

				//
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
				if (effect == 'cleanup') {
					if (this.causeOfDeath == 'sacrifice') {
						game.summonCard(this, cards.dustWight);
					}
				}
			}

		},
		suspiciousStatue: {
			name: 'Suspicious Statue',
			ident: 'suspiciousStatue',
			image: 'zand.png',
			mana: 1,
			damage: 0,
			health: 1,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'Battlerattle: Summon the leftmost 2 mana minion in your hand.',
			battleRattle: function(room, target) {
				var self = this;
				for (var key in room.players[self.player].cards) {
					if (room.players[self.player].cards[key].mana == 2) {
						game.summonCard(self, cards[room.players[self.player].cards[key].ident]);
						game.discardCard(room.players[self.player].cards[key]);
						return;
					}
				}

				//
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

				//
			}

		},
		cunningCobra: {
			name: 'Cunning Cobra',
			ident: 'cunningCobra',
			image: 'cobra.png',
			mana: 2,
			damage: 4,
			health: 4,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			battleRattleTarget: true,
			description: 'Battlerattle: Deal 4 damage to a minion. If it kills the minion, draw a card.',
			battleRattle: function(room, target) {
				var self = this;
				if (target) {
					if (target.health <= 4) {
						game.draw(self);
					}
					damage(room, target, 4);
				}

				//
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

				//
			}

		},
		desertMarauder: {
			name: 'Desert Marauder',
			ident: 'desertMarauder',
			image: 'maraudererer.png',
			mana: 2,
			damage: 5,
			health: 3,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			battleRattleTarget: true,
			description: 'Battlerattle: Deal damage to a minion equal to x2 the number of minions on your board.',
			battleRattle: function(room, target) {
				var self = this;
				if (target) {
					damage(room, target, (_.size(room.players[self.player].board) - 1) * 2);
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

				//
			}

		},
		locustSwarm: {
			name: 'Locust Swarm',
			ident: 'locustSwarm',
			image: 'swarm.png',
			mana: 2,
			damage: 6,
			health: 4,
			attacks: 0,
			causeOfDeath: 'notDead',
			type: 'minion',
			description: 'When this minion is sacrificed return it to your hand.',
			battleRattle: function(room, target) {
				var self = this;

				//
			},
			deathCry: function(room) {
				var self = this;
				if (self.causeOfDeath == 'sacrifice') {
					game.draw(self, ['locustSwarm']);
				}
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

				//
			}

		}
	};

	return cards;
};
