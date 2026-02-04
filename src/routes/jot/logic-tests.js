import { describe, it, expect } from 'vitest';
import mod from './logic.js';

function uItem (properties = {}) {
	return Object.assign({
		description: Math.random().toString(),
		dateCreated: new Date(),
	}, properties);
};

describe('itemPlaintext', () => {
	
	it('returns input', () => {
		const description = Math.random().toString();
		expect(mod.itemPlaintext(uItem({
			description,
		}))).toBe(description);
	});
	
	it('strikes if completed', () => {
		const description = Math.random().toString();
		expect(mod.itemPlaintext(uItem({
			description,
			completed: true,
		}))).toBe(`~~${ description }~~`);
	});

});

describe('itemHTML', () => {
	
	it('converts newlines', () => {
		const description = [Math.random().toString(), Math.random().toString()].join('\n\n\n');
		expect(mod.itemHTML(uItem({
			description,
		}))).toBe(description.replaceAll('\n', '<br>'));
	});

});

describe('heading', () => {

	it('returns string', () => {
		const item = new Date();
		expect(mod.heading(item)).toBe('# ' + item.toJSON().slice(0, 10));
	});

	it('returns Other if not valid', () => 
		expect(mod.heading(Math.random().toString())).toBe('# Other')
	);

});

describe('groupItems', () => {

	it('groups by date', () => {
		const items = [uItem(), uItem()];
		expect(mod.groupItems(items)).toEqual([{
			name: mod.heading(items[0].dateCreated),
			items,
		}]);
	});
	
	it('groups unknown', () => {
		const items = [uItem({
			dateCreated: undefined,
		})];
		expect(mod.groupItems(items)).toEqual([{
			name: '# Other',
			items,
		}]);
	});
	
	it('sorts by date descending', () => {
		const items = [uItem({
			dateCreated: new Date('2000-01-01'),
		}), uItem()];
		expect(mod.groupItems(items)).toEqual([{
			name: mod.heading(items[1].dateCreated),
			items: [items[1]],
		}, {
			name: mod.heading(items[0].dateCreated),
			items: [items[0]],
		}]);
	});
	
	it('sorts items ascending', () => {
		const items = [uItem({
			dateCreated: new Date('2000-01-01 12:01'),
		}), uItem({
			dateCreated: new Date('2000-01-01 12:00'),
		})];
		expect(mod.groupItems(items)).toEqual([{
			name: mod.heading(items[0].dateCreated),
			items,
		}]);
	});

});

describe('groupsPlaintext', () => {
	
	it('returns string', () => {
		const items = [uItem({
			dateCreated: new Date('2000-01-01'),
		}), uItem()];
		expect(mod.groupsPlaintext(mod.groupItems(items))).toEqual([
			mod.heading(items[0].dateCreated),
			mod.itemPlaintext(items[0]),
			mod.heading(items[1].dateCreated),
			mod.itemPlaintext(items[1]),
		].join('\n\n'));
	});

});
