import * as assert from 'assert';

import BaseProvider from './base';

import { IStyleBlock } from '../types';

class TestBaseProvider extends BaseProvider {
	public supportedSyntaxes(): string[] {
		return ['css'];
	}

	public getBlocks(): IStyleBlock[] {
		return [
			{ syntax: 'css', content: '.text { content: ""; display: block; }', range: null, error: null, changed: false }
		];
	}
}

describe('Providers → Base', () => {
	const provider = new TestBaseProvider(null, null, 'css', {
		config: {
			order: [],
			'properties-order': ['display', 'content']
		},
		syntaxAssociations: {}
	});

	it('should create instance', () => {
		assert.ok(provider instanceof BaseProvider);
	});

	it('should return true for supported syntax', () => {
		assert.ok(provider.isApplycable());
	});

	it('should return config from settings', async () => {
		const config = await provider.getConfig();

		assert.equal(config.from, 'settings');
	});

	it('should return formated content', async () => {
		const expected: IStyleBlock[] = [{
			syntax: 'css',
			range: null,
			content: '.text { display: block; content: ""; }',
			error: null,
			changed: true
		}];

		const actual = await provider.format();

		assert.deepEqual(actual, expected);
	});
});
