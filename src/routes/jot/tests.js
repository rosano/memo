import { describe, it, expect } from 'vitest';
import mod from './logic.js';

describe('formatPlaintext', () => {
	
	it('returns input', () => {
		const item = Math.random().toString();
		expect(mod.formatPlaintext(item)).toBe(item);
	});
	
	it('converts newlines', () => {
		const item = Math.random().toString() + '\n';
		expect(mod.formatPlaintext(item)).toBe(item.trim() + '<br>');
	});

});

describe('heading', () => {

	it('throws if not valid', () => {
		expect(() => mod.heading()).toThrowError('expected date');
	});
	
	it('returns string', () => {
		const item = new Date();
		expect(mod.heading(item)).toBe('# ' + item.toJSON().slice(0, 10));
	});

});

describe('groupItems', () => {

	function uItem (properties = {}) {
		return Object.assign({
			description: Math.random().toString(),
			dateCreated: new Date(),
		}, properties);
	};
	
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
			name: 'Other',
			items,
		}]);
	});
	
	it('sorts newer dates lower', () => {
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
			items: items.slice().reverse(),
		}]);
	});

});
