import { addPluginTemplate, createResolver, defineNuxtModule, isNuxt2 } from '@nuxt/kit';
import { isArray } from '@morev/utils';
import type { PartialOptions } from './types';

const BABEL_PLUGIN_NAME = '@babel/plugin-transform-logical-assignment-operators';
const SCOPE = '@morev';
const MODULE_NAME = `${SCOPE}/smooth-scroll`;

export default defineNuxtModule<PartialOptions>({
	meta: {
		name: '@morev/smooth-scroll',
		configKey: 'smoothScroll',
		compatibility: {
			nuxt: '>= 2.17.0 || >=3.5.0',
		},
	},
	defaults: {},
	hooks: {},
	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url);

		// This is necessary because the package uses utilities
		// that use modern syntax and have not been transpiled.
		if (isNuxt2()) {
			nuxt.options.build.transpile.push('@morev/utils', 'ohash', MODULE_NAME);

			/* @ts-expect-error -- Lack of compatibility with Nuxt 2 */
			nuxt.options.build.babel.plugins ??= [];
			/* @ts-expect-error -- Lack of compatibility with Nuxt 2 */
			const doesBabelPluginExists = nuxt.options.build.babel.plugins.some((plugin) => {
				return isArray(plugin)
					? plugin[0] === BABEL_PLUGIN_NAME
					: plugin === BABEL_PLUGIN_NAME;
			});

			/* @ts-expect-error -- Lack of compatibility with Nuxt 2 */
			!doesBabelPluginExists && nuxt.options.build.babel.plugins.push(BABEL_PLUGIN_NAME);
		}

		addPluginTemplate({
			src: resolver.resolve('nuxt-plugin.js'),
			filename: 'smooth-scroll-plugin.client.js',
			options: {
				options,
				isNuxt2: isNuxt2(),
			},
		});
	},
});
