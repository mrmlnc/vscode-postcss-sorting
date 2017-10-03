'use strict';

import * as vscode from 'vscode';

export function output(channel: vscode.OutputChannel, message: string, autoShowOutput = true): void {
	if (!channel) {
		channel = vscode.window.createOutputChannel('Stylefmt');
	}

	channel.clear();
	channel.appendLine('[Stylefmt]');
	channel.append(message.toString());

	if (autoShowOutput) {
		channel.show();
	}
}
