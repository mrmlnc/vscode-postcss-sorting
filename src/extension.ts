'use strict';

import * as vscode from 'vscode';

import ConfigProfiler from 'config-profiler';

import * as sorter from './postcss-sorting';
import * as settingsManager from './managers/settings';
import * as utils from './utils';

import { ISettings } from './types';

const configProfiler = new ConfigProfiler(null, {
	configFiles: [
		'postcss-sorting.js',
		'postcss-sorting.json',
		'.postcss-sorting.js',
		'.postcss-sorting.json'
	],
	props: {
		package: 'postcssSortingConfig'
	}
});

function getConfigForFile(document: vscode.TextDocument, config: object | string) {
	return configProfiler.getConfig(document.uri.fsPath, { settings: config });
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

	// Set current workspace
	configProfiler.setWorkspace(vscode.workspace.rootPath || process.cwd());

	// For plugin command: "postcssSorting.execute"
	const command = vscode.commands.registerTextEditorCommand('postcssSorting.execute', (textEditor) => {
		const settings = settingsManager.getSettings();
		const document = textEditor.document;

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
			const settings = settingsManager.getSettings();

			return use(settings, document, range)
				.then((result) => {
					if (!result) {
						return;
					}

					return [vscode.TextEdit.replace(result.range, result.css)];
				})
				.catch((err) => utils.output(outputChannel, err, settings.showErrorMessages));
		}
	});

	// Subscriptions
	context.subscriptions.push(command);
	context.subscriptions.push(format);
}
