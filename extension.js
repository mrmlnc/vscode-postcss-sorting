'use strict';

const vscode = require('vscode');
const postcss = require('postcss');
const sorting = require('postcss-sorting');

function getSyntax(language) {
	switch (language) {
		case 'less':
			return require('postcss-less');
		case 'scss':
			return require('postcss-scss');
		default:
			return false;
	}
}

function activate(context) {
	const processEditor = vscode.commands.registerTextEditorCommand('postcssSorting.sort', (textEditor) => {
		const options = vscode.workspace.getConfiguration('postcssSorting');

		const document = textEditor.document;
		const documentText = document.getText();
		const lastLine = document.lineAt(document.lineCount - 1);
		const selectAll = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.range.end.character);

		const lang = document.languageId || document._languageId;
		const syntax = getSyntax(lang);

		postcss([sorting(options)])
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

	context.subscriptions.push(processEditor);
}

exports.activate = activate;
