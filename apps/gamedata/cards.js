var iconMapper = require('../util/iconMapper');

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
	var cards = {
		dean: {
			name: 'Dean',
			mana: 1,
			damage: 1,
			health: 1,
			attacks: 0,
			description: 'Battlerattle: If dean is playing the game, he must give everyone chocolate.',
			battleRattle: function (room, target) {
				var self = this;

				//
			},
			deathCry: function (board) {
				var self = this;

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

				target.health -= self.damage;
				self.health -= target.damage;
				if (target.health <= 0) {
					game.killCard(target);
				}
				if (self.health <= 0) {
					game.killCard(self);
				}
			}
		},
		bloodManos: {
			name: 'Blood Manos',
			mana: 1,
			damage: 1,
			health: 1,
			description: 'ALL MINIONS.',
			battleRattle: function (board, target) {
				var self = this;

				//
			},
			deathCry: function (board) {
				var self = this;

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
			attack: function (board, target) {
				var self = this;

				console.log('attack happened');
				target.health -= self.damage;
				self.health -= target.damage;
				if (target.health <= 0) {
					game.killCard(target);
				}
				if (self.health <= 0) {
					game.killCard(self);
				}
			}
		}
	};

	return cards;
}
