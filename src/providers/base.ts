import ConfigProfiler from 'config-profiler';

import * as postcssSorting from '../services/postcss-sorting';

import { IFoundedConfig, IPluginSettings, IStyleBlock } from '../types';

const configProfiler = new ConfigProfiler(null, {
	allowHomeDirectory: true,
	configFiles: [
		'.postcss-sorting.json',
		'postcss-sorting.json'
	],
	envVariableName: 'POSTCSS_SORTING_CONFIG',
	props: {
		package: 'postcssSortingConfig'
	}
});

export default class BaseProvider {
	constructor(
		private readonly workspace: string,
		private readonly filepath: string,
		public readonly syntax: string,
		private readonly settings: IPluginSettings
	) { }

	public supportedSyntaxes(): string[] {
		return [];
	}

	public getBlocks(): IStyleBlock[] {
		return [];
	}

	public isApplycable(): boolean {
		return this.supportedSyntaxes().indexOf(this.syntax) !== -1;
	}

	public async format(): Promise<IStyleBlock[]> {
		const blocks = this.getBlocks();
		const foundedConfig = await this.getConfig();

		let config = {};
		if (foundedConfig) {
			config = foundedConfig.config;
		}

		for (const block of blocks) {
			const text = block.content;
			const syntax = block.syntax;

			try {
				const changes = await postcssSorting.use(this.filepath, text, syntax, config);

				if (changes !== block.content) {
					block.content = changes;
					block.changed = true;
				}
			} catch (err) {
				block.error = err;
			}
		}

		return blocks;
	}

	public getConfig(): Promise<IFoundedConfig> {
		configProfiler.setWorkspace(this.workspace);

		return configProfiler.getConfig(this.filepath, { settings: this.settings.config });
	}

	public getSyntax(syntax: string): string {
		const syntaxAssociation = this.settings.syntaxAssociations[syntax];

		return syntaxAssociation || syntax;
	}
}
