const uAscending = function (a, b) {
	return (a < b) ? -1 : ((a > b) ? 1 : 0);
};

const uDescending = function (a, b) {
  return (a > b) ? -1 : ((a < b) ? 1 : 0);
};

const mod = {

	itemPlaintext (item) {
		const wrap = item.completed ? '~~' : '';
		return wrap + item.description.replaceAll('\n', '<br>') + wrap ;
	},

	heading (input) {
		return '# ' + ((typeof input === 'object') && (input instanceof Date) && !Number.isNaN(input.getTime()) ? input.toJSON().slice(0, 10) : 'Other');
	},

	groupItems (input) {
		return input.reduce((coll, item) => {
			const name = mod.heading(item.dateCreated);
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
