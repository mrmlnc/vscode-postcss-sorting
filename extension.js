'use strict';

var vscode = require('vscode');
var postcss = require('postcss');

function activate(context) {
	var processEditor = vscode.commands.registerTextEditorCommand('PostCSSSorting.processEditor', function(textEditor) {
		var options = Object.assign({
			'sort-order': 'default',
			'empty-lines-between-children-rules': 0,
			'sort-on-save': false
		}, vscode.workspace.getConfiguration('PostCSSSorting'));

		var document = textEditor.document;
		var documentText = document.getText();
		var lastLine = document.lineAt(document.lineCount - 1);
		var selectAll = new vscode.Range(0, 0, lastLine.lineNumber, lastLine.range.end.character);
		var lang = document.languageId || document._languageId;

		if (lang === 'sass') {
			lang = require('postcss-scss');
		} else {
			lang = {};
		}

		postcss([require('postcss-sorting')(options)])
			.process(documentText, {
				syntax: lang
			})
			.then(function(result) {
				textEditor.edit(function(editBuilder) {
					editBuilder.replace(selectAll, result.css);
				});
			})
			.catch(function(err) {
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
