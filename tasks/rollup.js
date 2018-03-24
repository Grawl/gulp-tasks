import {rollup} from 'rollup'
import sourceMaps from 'rollup-plugin-sourcemaps'
import nodeResolve from 'rollup-plugin-node-resolve'
import includePaths from 'rollup-plugin-includepaths'
import babelRC from 'babelrc-rollup'
import babel from 'rollup-plugin-babel'
import progress from 'rollup-plugin-progress'
import visualizer from 'rollup-plugin-visualizer'
export default function rollup_task(bundles, options) {
	let rollupCache = []
	const bundleSettings = {
		sourceMap: true,
	}
	const defaultPlugins = bundleConfig => [
		sourceMaps({ loadMaps: true }),
		nodeResolve({
			browser: true,
		}),
		includePaths({
			paths: options.includePaths,
			extensions: ['.js', '.json'],
		}),
		babel(babelRC()),
		progress({
			clearLine: false
		}),
		visualizer({
			filename: `./rollup-visualizer-${bundleConfig.moduleName}.html`
		}),
	]
	const plugins = bundleConfig => [].concat(options.plugins, defaultPlugins(bundleConfig))
	return Promise.all(bundles.map((bundleConfig, index) => {
		const config = {
			input: bundleConfig.input,
			file: bundleConfig.output,
			format: bundleConfig.format ? bundleConfig.format : 'iife',
			context: bundleConfig.context ? bundleConfig.context : 'window',
			moduleName: bundleConfig.moduleName ? bundleConfig.moduleName : 'script',
		}
		return rollup({
			input: config.input,
			plugins: plugins(config),
			cache: rollupCache[index],
		})
			.then(bundle => {
				rollupCache[index] = bundle
				bundle.write(Object.assign(bundleSettings, config))
					.catch(reason => console.warn({'rollup bundle write error': reason}))
				return bundle.modules.length
			})
			.catch(reason => console.warn({'rollup error': reason}))
			.then(count => {
				let countString = count > 1 ? countString = `📦${count} ` : ''
				console.log(countString + `📄${config.input}`)
			})
	}))
		.then(count => {
			if(count.length > 1) console.log('all scripts bundled')
		})
		// TODO gulp-notify integration
		.catch(reject => console.error('scripts bundling error', reject))
}
