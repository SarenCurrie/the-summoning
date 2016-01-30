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
