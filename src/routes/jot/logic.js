const uAscending = function (a, b) {
	return (a < b) ? -1 : ((a > b) ? 1 : 0);
};

const uDescending = function (a, b) {
  return (a > b) ? -1 : ((a < b) ? 1 : 0);
};

const mod = {

	formatPlaintext (input) {
		return input.replaceAll('\n', '<br>');
	},

	heading (input) {
		if ((input instanceof Date) && !Number.isNaN(input.getTime())) {
			return input.toJSON().slice(0, 10);
		}
		
		throw new Error('expected date');
	},

	groupItems (input) {
		return input.reduce((coll, item) => {
			const name = item.dateCreated ? mod.heading(item.dateCreated) : 'Other';
			const filter = e => e.name === name;

			const group = coll.filter(filter).shift() || {
				name,
				items: []
			};

			group.items = group.items.concat(item).sort((a, b) => uAscending(a.dateCreated, b.dateCreated));

			return coll.filter(e => !filter(e)).concat(group).sort((a, b) => uDescending(a.name, b.name));
		}, []);
	},

};

export default mod;
