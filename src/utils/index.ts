'use strict';

import * as vscode from 'vscode';

export function output(output: vscode.OutputChannel, message: string, autoShowOutput = true): void {
	if (!output) {
		output = vscode.window.createOutputChannel('Stylefmt');
	}

	output.clear();
	output.appendLine('[Stylefmt]');
	output.append(message.toString());

	if (autoShowOutput) {
		output.show();
	}
}
