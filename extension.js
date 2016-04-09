'use strict';

var vscode = require('vscode');
var postcss = require('postcss');
var postcssSorter = require('postcss-sorting');

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

		postcss([postcssSorter(options)])
			.process(documentText)
			.then(function(result) {
				textEditor.edit(function(editBuilder) {
					editBuilder.replace(selectAll, result.css);
				});
			});
	});

	context.subscriptions.push(processEditor);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
