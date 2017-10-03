'use strict';

import * as vscode from 'vscode';

import { ISettings } from '../types';

export function getSettings(workspace: vscode.Uri): ISettings {
	const settings = vscode.workspace.getConfiguration(null, workspace).get('postcssSorting') as ISettings;
	const formatOnSave = vscode.workspace.getConfiguration('editor', workspace).get('formatOnSave');

	if (formatOnSave) {
		settings.showErrorMessages = false;
	}

	return settings;
}
