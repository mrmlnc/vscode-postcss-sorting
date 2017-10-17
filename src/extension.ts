'use strict';

import * as vscode from 'vscode';

import ConfigProfiler from 'config-profiler';

import * as sorter from './postcss-sorting';
import * as settingsManager from './managers/settings';
import * as utils from './utils';

import { ISettings } from './types';

const configProfiler = new ConfigProfiler(null, {
	allowHomeDirectory: true,
	configFiles: [
		'postcss-sorting.js',
		'postcss-sorting.json',
		'.postcss-sorting.js',
		'.postcss-sorting.json'
	],
	envVariableName: 'POSTCSS_SORTING_CONFIG',
	props: {
		package: 'postcssSortingConfig'
	}
});

function getConfigForFile(document: vscode.TextDocument, config: object | string) {
	const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
	const filepath = document.uri.fsPath;

	// Use workspace directory or filepath of current file as workspace folder
	const workspace = workspaceFolder ? workspaceFolder.uri.fsPath : filepath;

	// Set current workspace
	configProfiler.setWorkspace(workspace);

	return configProfiler.getConfig(filepath, { settings: config });
}

function use(settings: ISettings, document: vscode.TextDocument, range: vscode.Range) {
	return getConfigForFile(document, settings.config)
		.then((config) => !config ? null : sorter.use(config, document, range));
}

export function activate(context: vscode.ExtensionContext) {
	const outputChannel: vscode.OutputChannel = null;

	// Supported languages
	const supportedDocuments: vscode.DocumentSelector = [
		{ language: 'css', scheme: 'file' },
		{ language: 'postcss', scheme: 'file' },
		{ language: 'scss', scheme: 'file' },
		{ language: 'less', scheme: 'file' }
	];

	// For plugin command: "postcssSorting.execute"
	const command = vscode.commands.registerTextEditorCommand('postcssSorting.execute', (textEditor) => {
		// Prevent run command without active TextEditor
		if (!vscode.window.activeTextEditor) {
			return null;
		}

		const document = textEditor.document;

		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
		const workspaceUri = workspaceFolder ? workspaceFolder.uri : null;
		const settings = settingsManager.getSettings(workspaceUri);

		use(settings, document, null)
			.then((result) => {
				if (!result) {
					return;
				}

				textEditor.edit((editBuilder) => {
					editBuilder.replace(result.range, result.css);
				});
			})
			.catch((err) => utils.output(outputChannel, err, settings.showErrorMessages));
	});

	// For commands: "Format Document" and "Format Selection"
	const format = vscode.languages.registerDocumentRangeFormattingEditProvider(supportedDocuments, {
		provideDocumentRangeFormattingEdits(document, range) {
			// Prevent run command without active TextEditor
			if (!vscode.window.activeTextEditor) {
				return null;
			}

			const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
			const workspaceUri = workspaceFolder ? workspaceFolder.uri : null;
			const settings = settingsManager.getSettings(workspaceUri);

			return use(settings, document, range)
				.then((result) => {
					if (!result) {
						return;
					}

					return <any>[vscode.TextEdit.replace(result.range, result.css)];
				})
				.catch((err) => utils.output(outputChannel, err, settings.showErrorMessages));
		}
	});

	// Subscriptions
	context.subscriptions.push(command);
	context.subscriptions.push(format);
}
