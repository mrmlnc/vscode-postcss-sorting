import * as assert from 'assert';

import * as proxyquire from 'proxyquire';

import * as testUtils from '../test/utils';

import StylesProvider from './styles';

import { IStyleBlock } from '../types';

const text = [
	'.text {',
	'  content: "";',
	'  display: block;',
	'}'
].join('\n');

describe('Providers → Styles', () => {
	// tslint:disable-next-line
	const Provider = proxyquire('./styles', {
		vscode: {
			Position: testUtils.Position,
			Range: testUtils.Range,
			'@noCallThru': true
		}
	}).default;

	const document = testUtils.mockupDocument(text);
	const provider: StylesProvider = new Provider(document, null, 'scss', null, '.tmp/test.scss', {
		preset: {
			order: [],
			'properties-order': ['display', 'content']
		},
		syntaxAssociations: {}
	});

	it('should return true for supported syntax', () => {
		assert.ok(provider.isApplycable());
	});

	it('should return formated content', async () => {
		const expected: IStyleBlock[] = <IStyleBlock[]>[{
			syntax: 'scss',
			range: {
				start: { line: 0, character: 0 },
				end: { line: 3, character: 1 }
			},
			content: '.text {\n  display: block;\n  content: \"\";\n}',
			error: null,
			changed: true
		}];

		const actual = await provider.format();

		assert.deepEqual(actual, expected);
	});
});
