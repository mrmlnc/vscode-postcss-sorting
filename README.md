# VS Code Post​CSS Sorting

> VS Code plugin to sort CSS rules content with specified order. Powered by [postcss-sorting](https://github.com/hudochenkov/postcss-sorting).

![2016-04-10_02-46-24](https://cloud.githubusercontent.com/assets/7034281/14407132/77dd07c4-fec6-11e5-8361-a47af434459c.gif)

## Install

To install, press `F1` and select `Extensions: Install Extensions` and then search for and select `postcss-sorting`.

## Usage

Press `F1` and run the command named `Post​CSS Sorting: Run`.

## Supported languages

  * CSS
  * Less (experimental support)
  * SCSS
  * Sass (by [sass-indented](https://marketplace.visualstudio.com/items?itemName=robinbentley.sass-indented))
  * Stylus (by [extensions](https://marketplace.visualstudio.com/search?term=stylu&target=VSCode&sortBy=Relevance))

## Keyboard shortcuts

For changes keyboard shortcuts, create a new rule in `File -> Preferences -> Keyboard Shortcuts`:

```json
{
  "key": "ctrl+shift+c",
  "command": "postcssSorting.sort"
}
```

## Options

You can override the default and user settings for individual projects. Just add an `postcssSorting` object to the `settings.json`file.

For example:

```json
{
  "postcssSorting": {
    "sort-order": ["padding", "margin"],
    "preserve-empty-lines-between-children-rules": true
  }
}
```

See the [postcss-sorting documentation](https://github.com/hudochenkov/postcss-sorting#options) for all rules and predefined configs.

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/vscode-postcss-sorting/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
