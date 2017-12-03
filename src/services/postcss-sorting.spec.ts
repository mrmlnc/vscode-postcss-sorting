import * as assert from 'assert';

import * as service from './postcss-sorting';

describe('Services → Postcss-sorting', () => {
	const config = {
		order: [],
		'properties-order': ['display', 'content']
	};

	it('should work with "CSS" syntax', async () => {
		const text = [
			'.text { content: ""; display: block; }'
		].join('\n');

		const expected = [
			'.text { display: block; content: ""; }'
		].join('\n');

		const actual = await service.use('filename.css', text, 'css', config);

		assert.deepEqual(actual, expected);
	});

	it('should work with "LESS" syntax', async () => {
		const text = [
			'.text { content: ""; display: block; }'
		].join('\n');

		const expected = [
			'.text { display: block; content: ""; }'
		].join('\n');

		const actual = await service.use('filename.less', text, 'less', config);

		assert.deepEqual(actual, expected);
	});

	it('should work with "SCSS" syntax', async () => {
		const text = [
			'.text { content: ""; display: block; }'
		].join('\n');

		const expected = [
			'.text { display: block; content: ""; }'
		].join('\n');

		const actual = await service.use('filename.less', text, 'scss', config);

		assert.deepEqual(actual, expected);
	});

	it('should work with "SugarSS" syntax', async () => {
		const text = [
			'.text',
			'  content: ""',
			'  display: block',
			''
		].join('\n');

		const expected = [
			'.text',
			'  display: block',
			'  content: ""',
			''
		].join('\n');

		const actual = await service.use('filename.sss', text, 'sugarss', config);

		assert.deepEqual(actual, expected);
	});
});
