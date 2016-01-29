var icons = {
	manPower: 'users',
	food: 'cutlery',
	wood: 'tree',
	gold: 'dot-circle-o'
}

var getIcon = function (name) {
	if (icons.hasOwnProperty(name)) {
		return icons[name];
	} else {
		console.warn('icon for ' + name + ' not found, using implicit icon');
		return name;
	}
}

module.exports = getIcon;
