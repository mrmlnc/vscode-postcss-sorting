'use strict';

import * as vscode from 'vscode';

import * as postcss from 'postcss';
import * as postless from 'postcss-less';
import * as postscss from 'postcss-scss';
import * as postcssSorting from 'postcss-sorting';

import ConfigResolver from 'vscode-config-resolver';

function getSyntax(language) {
	switch (language) {
		case 'less':
			return postless;
		case 'scss':
			return postscss;
		default:
			return false;
	}
}

/**
 * Check syntax support.
 *
 * @param {any} ext
 * @returns {boolean}
 */
function isSupportedSyntax(document: vscode.TextDocument): boolean {
	return /(css|less|scss)/.test(document.languageId);
}

export function activate(context: vscode.ExtensionContext) {
	const onCommand = vscode.commands.registerTextEditorCommand('postcssSorting.sort', (textEditor) => {
		const settings = vscode.workspace.getConfiguration().get('postcssSorting');
		const configResolver = new ConfigResolver(vscode.workspace.rootPath);
		const options = {
			packageProp: 'postcssSortingConfig',
			configFiles: [
				'.postcss-sorting.json',
				'postcss-sorting.json'
			],
			editorSettings: settings
		};

		configResolver.scan(textEditor.document.uri.fsPath, options).then((config) => {
			const document = textEditor.document;
			if (!isSupportedSyntax(document)) {
				console.error('Cannot execute PostCSS Sorting because there is not style files. Supported: LESS, SCSS and CSS.');
				return;
			}

			const documentText = document.getText();
			const lastLine = document.lineAt(document.lineCount - 1);
			const selectAll = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.range.end.character);

			const lang = document.languageId;
			const syntax = getSyntax(lang);

			postcss([postcssSorting((config && config.json) || {})])
				.process(documentText, syntax && { syntax })
				.then((result) => {
					textEditor.edit((editBuilder) => {
						editBuilder.replace(selectAll, result.css);
					});
				})
				.catch((err) => {
					vscode.window.showWarningMessage(err);
				});
		});
	});

	context.subscriptions.push(onCommand);
}
