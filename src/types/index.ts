import { Range } from 'vscode';

/**
 * Plugin preset.
 */
export interface IPreset {
	[prop: string]: {};
}

/**
 * The plugin settings.
 */
export interface IPluginSettings {
	config?: string | IPreset;
	ignoreFilesOnSave?: string[];
	formatOnSave?: boolean;
	syntaxAssociations?: Record<string, string>;
	showErrorMessages?: boolean;
}

/**
 * The standard block of styles for processing.
 */
export interface IStyleBlock {
	range: Range;
	syntax: string;
	content: string;
	error: string;
	changed: boolean;
}

/**
 * The founded config by Config Profiler.
 */
export interface IFoundedConfig {
	from: string;
	config: object;
}
