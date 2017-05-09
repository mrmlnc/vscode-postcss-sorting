'use strict';

import * as vscode from 'vscode';

import * as postcss from 'postcss';
import * as postless from 'postcss-less';
import * as postscss from 'postcss-scss';
import * as postcssSorting from 'postcss-sorting';

import { ISettings, IResult } from '../types';

/**
 * Check syntax support.
 */
export function isSupportedSyntax(language: string): boolean {
	return ['css', 'postcss', 'less', 'scss'].indexOf(language) !== -1;
}

function getSyntax(language: string) {
	switch (language) {
		case 'less':
			return postless;
		case 'scss':
			return postscss;
		default:
			return false;
	}
}

export async function use(settings: ISettings, document: vscode.TextDocument, range: vscode.Range): Promise<IResult> {
	if (!isSupportedSyntax(document.languageId)) {
		console.error('Cannot execute PostCSS Sorting because there is not style files. Supported: LESS, SCSS and CSS.');
		return;
	}

	let text;
	if (!range) {
		const lastLine = document.lineAt(document.lineCount - 1);
		const start = new vscode.Position(0, 0);
		const end = new vscode.Position(document.lineCount - 1, lastLine.text.length);

		range = new vscode.Range(start, end);
		text = document.getText();
	} else {
		text = document.getText(range);
	}

	const syntax = getSyntax(document.languageId);
	const postcssConfig: postcss.ProcessOptions = {
		from: document.uri.fsPath || vscode.workspace.rootPath || ''
	};

	if (syntax) {
		postcssConfig.syntax = syntax;
	}

	const postcssPlugins: postcss.AcceptedPlugin[] = [
		postcssSorting(settings.config)
	];

	return postcss(postcssPlugins)
		.process(text, postcssConfig)
		.then((result) => (<IResult>{
			css: result.css,
			range
		}));
}
