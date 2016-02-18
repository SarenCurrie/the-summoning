var cache = {};

Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
	if (arguments.length < 3)
	throw new Error('Handlebars Helper equal needs 2 parameters');
	if (lvalue != rvalue) {
		return options.inverse(this);
	} else {
		return options.fn(this);
	}
});

Handlebars.registerHelper('socketId', function(id) {
	if (arguments.length < 2)
		throw new Error('Handlebars Helper socketId needs 1 parameter');
	if (id.startsWith('/#')) {
		return id.substring(2);
	} else {
		return id;
	}
});

function template(name, data) {
	var _template;
	var result;

	if (cache[name]) {
		_template = cache[name];
	} else {
		$.ajax({
			url: 'templates/' + name + '.html',
			dataType: 'text',
			async: false,
			success: function(result) {
				_template = result;
			},
			error: function(xhr, status, err) {
				_template = status + ': ' + err;
			}
		});
	}

	cache[name] = _template;

	_template = Handlebars.compile(_template);

	result = _template(data);

	return result;
}
