var iconMapper = require('../util/iconMapper');

module.exports = {
	population: {
		name: 'Citizen',
		cost: {
			food: {
				icon: iconMapper('food'),
				count: 20
			}
		},
		effect: {
			instant: {
				resources: {
					manPower: {
						count: 1
					}
				},
				buildings: {
					population: {
						costChange: {
							food: {
								count: 10
							}
						}
					}
				}
			}
		}
	}
}
