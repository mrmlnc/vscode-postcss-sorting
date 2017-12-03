'use strict';

import * as assert from 'assert';

import * as proxyquire from 'proxyquire';

function makeVscodeWorkspace(): object {
	return {
		getConfiguration: () => ({
			get: (type: string) => {
				if (type === 'postcssSorting') {
					return { config: {}, showErrorMessages: true };
				}
				if (type === 'formatOnSave') {
					return true;
				}
			}
		})
	};
}

describe('Managers → Settings', () => {
	let manager;

	before(() => {
		manager = proxyquire('./settings', {
			vscode: { workspace: makeVscodeWorkspace(), '@noCallThru': true }
		});
	});

	describe('.getSettings', () => {
		it('should return settings', () => {
			const expected = { config: {}, showErrorMessages: false };
			const actual = manager.getSettings();

			assert.deepEqual(actual, expected);
		});
	});
});
