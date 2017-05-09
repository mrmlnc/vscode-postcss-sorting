'use strict';

import * as vscode from 'vscode';

import { ISettings } from '../types';

export function getSettings(): ISettings {
	const settings = Object.assign(
		{},
		vscode.workspace.getConfiguration().get<ISettings>('postcssSorting'),
		vscode.workspace.getConfiguration('editor').get('formatOnSave')
	);

	if (settings.formatOnSave) {
		settings.showErrorMessages = false;
	}

	return settings;
}
