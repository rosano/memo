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
