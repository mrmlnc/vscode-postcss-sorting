# VS Code Post​CSS Sorting

> VS Code plugin to sort CSS rules content with specified order. Powered by [postcss-sorting](https://github.com/hudochenkov/postcss-sorting).

## Install

  * Press <kbd>F1</kbd> and select `Extensions: Install Extensions`.
  * Search for and select `postcss-sorting`.

See the [extension installation guide](https://code.visualstudio.com/docs/editor/extension-gallery) for details.

## Usage

Press <kbd>F1</kbd> and run the command named `PostCSS Sorting: Run`.

## Supported languages

  * CSS
  * PostCSS
  * Less
  * SCSS

## Options

You can override the default and user settings for individual projects. Just add an `postcssSorting` object to the `settings.json` file.

For example:

```json
{
  "postcssSorting.config": {
    "order": [
      "custom-properties",
      "dollar-variables",
      "declarations",
      "at-rules",
      "rules"
    ],
    "properties-order": ["display", "position", "top", "right", "bottom", "left"]
  }
}
```

See the [postcss-sorting documentation](https://github.com/hudochenkov/postcss-sorting#options) for all rules and predefined configs.

Also we support:

  * `postcssSorting` as `string` starts with `.` or `~` or `/`
  * `postcssSortingConfig` property in `package.json`
  * `.postcss-sorting.json`
  * `postcss-sorting.json`
  * `POSTCSS_SORTING_CONFIG` env

## Keyboard shortcuts

For changes keyboard shortcuts, create a new rule in `File -> Preferences -> Keyboard Shortcuts`:

```json
{
  "key": "ctrl+shift+c",
  "command": "postcssSorting.execute"
}
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/vscode-postcss-sorting/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
