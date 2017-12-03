import * as path from 'path';

import * as micromatch from 'micromatch';
import * as vscode from 'vscode';

import StylesProvider from './providers/styles';

import { IPluginSettings } from './types';

let output: vscode.OutputChannel;

/**
 * Show message in iutput channel.
 */
function showOutput(msg: string, autoShowOutput: boolean = true): void {
	if (!output) {
		output = vscode.window.createOutputChannel('Postcss Sorting');
	}

	output.clear();
	output.appendLine('[Postcss Sorting]\n');
	output.append(msg);

	if (autoShowOutput) {
		output.show();
	}
}

interface IProviderOptions {
	document: vscode.TextDocument;
	selection: vscode.Selection;
	workspace: string;
	filepath: string;
	settings: IPluginSettings;
}

function getProvider(options: IProviderOptions): StylesProvider {
	const { document, selection, workspace, filepath, settings } = options;

	const stylesProvider = new StylesProvider(document, selection, document.languageId, workspace, filepath, settings);

	if (stylesProvider.isApplycable()) {
		return stylesProvider;
	}

	return null;
}

export function activate(context: vscode.ExtensionContext): void {
	const onCommand = vscode.commands.registerTextEditorCommand('postcssSorting.execute', (textEditor) => {
		// Prevent run command without active TextEditor
		if (!vscode.window.activeTextEditor) {
			return null;
		}

		const document = textEditor.document;
		const selection = textEditor.selection;
		const filepath = document.uri.fsPath;
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);

		// Use workspace directory or filepath of current file as workspace folder
		const workspace = workspaceFolder ? workspaceFolder.uri.fsPath : filepath;
		const workspaceUri = workspaceFolder ? workspaceFolder.uri : null;
		const settings = vscode.workspace.getConfiguration('postcssSorting', workspaceUri) as IPluginSettings;

		const provider = getProvider({
			document,
			selection,
			workspace,
			filepath,
			settings
		});

		if (!provider) {
			return showOutput(`We do not support "${document.languageId}" syntax.`);
		}

		provider.format().then((blocks) => {
			textEditor.edit((builder) => {
				blocks.forEach((block) => {
					if (block.error) {
						showOutput(block.error.toString(), settings.showErrorMessages);
					}

					builder.replace(block.range, block.content);
				});
			});
		}).catch((err: Error) => showOutput(err.stack, settings.showErrorMessages));
	});

	const onSave = vscode.workspace.onWillSaveTextDocument((event) => {
		// Prevent run command without active TextEditor
		if (!vscode.window.activeTextEditor) {
			return null;
		}

		const document = event.document;
		const filepath = document.uri.fsPath;
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
		// Use workspace directory or filepath of current file as workspace folder
		const workspace = workspaceFolder ? workspaceFolder.uri.fsPath : filepath;
		const workspaceUri = workspaceFolder ? workspaceFolder.uri : null;
		const settings = vscode.workspace.getConfiguration('postcssSorting', workspaceUri) as IPluginSettings;

		// Skip files without providers
		const provider = getProvider({
			document,
			selection: null,
			workspace,
			filepath,
			settings
		});

		// Skip the formatting code without Editor configuration
		if (!settings || !settings.formatOnSave || !provider) {
			return null;
		}

		// Skip excluded files by Editor
		let excludes: string[] = [];
		if (settings && settings.ignoreFilesOnSave.length !== 0) {
			excludes = excludes.concat(settings.ignoreFilesOnSave);
		}

		if (excludes.length !== 0) {
			const currentFile = path.relative(vscode.workspace.rootPath, event.document.fileName);
			if (micromatch([currentFile], excludes).length !== 0) {
				return null;
			}
		}

		const actions = provider.format().then((blocks) => {
			return blocks.map((block) => {
				if (block.error) {
					showOutput(block.error.toString(), settings.showErrorMessages);
				}

				return vscode.TextEdit.replace(block.range, block.content);
			});
		}).catch((err: Error) => showOutput(err.stack, settings.showErrorMessages));

		event.waitUntil(actions);
	});

	context.subscriptions.push(onCommand);
	context.subscriptions.push(onSave);
}
