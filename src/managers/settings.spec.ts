'use strict';

import * as assert from 'assert';

import * as proxyquire from 'proxyquire';

function makeVscodeWorkspace() {
	return {
		getConfiguration: () => ({
			get: (type: string) => {
				if (type === 'postcssSorting') {
					return { config: {}, showErrorMessages: true };
				}
				if (type === 'formatOnSave') {
					return { formatOnSave: true };
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
			const expected = { config: {}, showErrorMessages: false, formatOnSave: true };
			const actual = manager.getSettings();

			assert.deepEqual(actual, expected);
		});
	});
});
