import * as postcss from 'postcss';
import * as postless from 'postcss-less';
import * as postscss from 'postcss-scss';
import * as postcssSorting from 'postcss-sorting';
import * as sugarss from 'sugarss';

function getSyntax(language: string): postcss.Syntax {
	switch (language) {
		case 'less':
			return postless;
		case 'scss':
			return postscss;
		case 'sugarss':
			return sugarss;
		default:
			return null;
	}
}

/**
 * Apply "postcss-sorting" to the given text with provided config.
 */
export function use(filename: string, text: string, syntax: string, config: object): Promise<string> {
	const postcssConfig: postcss.ProcessOptions = {
		from: filename,
		syntax: getSyntax(syntax)
	};

	const postcssPlugins: postcss.AcceptedPlugin[] = [
		postcssSorting(config)
	];

	return postcss(postcssPlugins)
		.process(text, postcssConfig)
		.then((result) => result.content);
}
