'use strict';

import * as vscode from 'vscode';

export interface ISettings {
	config?: object | string;
	showErrorMessages?: boolean;
	formatOnSave?: boolean;
}

export interface IResult {
	css: string;
	range: vscode.Range;
}
