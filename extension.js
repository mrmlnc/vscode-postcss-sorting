'use strict';

const vscode = require('vscode');
const postcss = require('postcss');
const sorting = require('postcss-sorting');
const scssSyntax = require('postcss-scss');

function activate(context) {
	const processEditor = vscode.commands.registerTextEditorCommand('postcssSorting.sort', (textEditor) => {
		const options = Object.assign({
			'sort-order': 'default',
			'empty-lines-between-children-rules': 0,
			'empty-lines-between-media-rules': 0,
			'preserve-empty-lines-between-children-rules': false
		}, vscode.workspace.getConfiguration('postcssSorting'));

		const document = textEditor.document;
		const documentText = document.getText();
		const lastLine = document.lineAt(document.lineCount - 1);
		const selectAll = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.range.end.character);
		const lang = document.languageId || document._languageId;

		postcss([sorting(options)])
			.process(documentText, lang === 'sass' && {
				syntax: scssSyntax
			})
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

// this method is called when your extension is deactivated
function deactivate() {

}

exports.deactivate = deactivate;
