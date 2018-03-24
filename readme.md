# Gulp tasks

> WIP

## Install

Use NPM or Yarn or PNPM or whatever.

Tested on Yarn.

> NOTE: No `package.lock` provided, `yarn.lock` only.

## Requirements

- `github:gulpjs/gulp#4.0`
- `babel-plugin-external-helpers`
- `babel-preset-env`
- `babel-register`

## Usage

`gulpfile.babel.js`

```js
import gulp from 'gulp'
import tasks from 'gulp-tasks'
export function styles() {
	return tasks.sass({
		from: 'source/style.sass',
		to: 'public',
	})
}
import rollupPluginCommonjs from 'rollup-plugin-commonjs'
export function scripts() {
	return tasks.rollup([
		{
			input: 'source/script.js',
			output: 'public/script.js',
		}
	], {
		includePaths: 'source',
		plugins: [
			rollupPluginCommonjs({
				include: 'node_modules/**/*',
				namedExports: { 'jquery': ['$', 'jQuery'] }
			}),
		],
	})
}
export const build = gulp.parallel(styles, scripts)
export default build
```

Then, install `gulp-cli` module globally and run `gulp` or `gulp styles`.

Or run as NPM script: `"scripts": {"bulid": "gulp", "styles": "gulp styles" }`

> TIP: No need to install `gulp-cli` to your project if using NPM script. 

Or run with `npx gulp` or `npx gulp styles`

## Develop

1. Clone this repository
2. `cd gulp-tasks`
3. `yarn link`
4. `cd ../project-using-gulp-tasks`
5. `yarn link gulp-tasks` 

Now, you can change code in this module and test in your project.
