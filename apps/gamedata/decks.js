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
	var decks = {
		sacrifice: {
			cards: [
				'suspiciousStatue', 'trappedAdventurer', 'trappedAdventurer',
				'desertMarauder', 'cunningCobra', 'locustSwarm',
				'jackalwere', 'jackalwere', 'masonsApprentice',
				'masonsApprentice', 'masterMason', 'masterMason',
				'summoningStone', 'manicMerchant', 'acolyteOfTheSun',
				'acolyteOfTheSun', 'dustWight', 'theHarbinger',
				'mummyLord', 'skeletalSandworm', 'skeletalSandworm',
				'dustGolem', 'oasisDjinni', 'oasisDjinni',
				'priestessOfTheSun', 'basilisk', 'ferociousCamel',
				'sandShaper', 'valhallaRedeemer', 'astralOfTheSun'
			]
		},
		beast: {
			cards: [
				'youngHunter', 'youngHunter', 'ambush', 'ambush',
				'nightStalker', 'nightStalker', 'wildsDruid', 'wildsDruid',
				'plainsEagle', 'plainsEagle', 'huntsmaster', 'huntsmaster',
				'wolfBorther', 'wolfBorther', 'tundraStalker', 'tundraStalker',
				'carrionCrow', 'carrionCrow', 'loneHunter', 'loneHunter',
				'savageBear', 'savageBear', 'hawkScout', 'hawkScout',
				'packOutcast', 'packOutcast', 'alphaWolf', 'alphaWolf',
				'nightScrouge', 'nightScrouge'
			]
		}
	};

	return decks;
};
