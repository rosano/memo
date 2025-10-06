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

	groupItems (input) {
		return input.reduce((coll, item) => {
			const name = item.dateCreated ? item.dateCreated.toJSON().slice(0, 10) : 'Other';
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
